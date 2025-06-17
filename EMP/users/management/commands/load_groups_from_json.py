import json
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):
    help = 'Load groups and assign permissions from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to groups.json')

    def handle(self, *args, **options):
        json_file = options['json_file']

        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                groups_data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"File not found: {json_file}"))
            return
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f"JSON decode error: {e}"))
            return

        for group_data in groups_data:
            group_name = group_data.get('name')
            permissions = group_data.get('permissions', [])
            description = group_data.get('description', '')

            if not group_name:
                self.stdout.write(self.style.WARNING("Skipping group with no name"))
                continue

            group, created = Group.objects.get_or_create(name=group_name)
            group.permissions.clear()

            success_perms = []
            missing_perms = []

            for perm_str in permissions:
                try:
                    app_label, codename = perm_str.split('.')
                    permission = Permission.objects.get(
                        content_type__app_label=app_label,
                        codename=codename
                    )
                    group.permissions.add(permission)
                    success_perms.append(perm_str)
                except (ValueError, Permission.DoesNotExist):
                    missing_perms.append(perm_str)

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created group: {group_name}"))
            else:
                self.stdout.write(self.style.SUCCESS(f"Updated group: {group_name}"))

            self.stdout.write(self.style.NOTICE(f" ↳ {len(success_perms)} permissions assigned"))
            if missing_perms:
                self.stdout.write(self.style.WARNING(f" ↳ {len(missing_perms)} missing permissions: {missing_perms}"))

        self.stdout.write(self.style.SUCCESS("✅ Group import complete."))
