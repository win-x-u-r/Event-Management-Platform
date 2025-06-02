from django.core.management.base import BaseCommand
from events.models import Event
from budget.models import Budget
from utils.google_sheets import fetch_event_data
from datetime import datetime

class Command(BaseCommand):
    help = 'Import events from Google Sheet without duplicates'

    def handle(self, *args, **kwargs):
        data = fetch_event_data()
        new_events = 0
        skipped = 0

        for row in data:
            event_name = row.get('Event Name:')
            start_date_str = row.get('Start Date: ')
            start_date = datetime.strptime(start_date_str, "%m/%d/%Y").date() if start_date_str else None

            if not event_name or not start_date:
                continue

            # Check for duplicates
            if Event.objects.filter(name=event_name, start_date=start_date).exists():
                skipped += 1
                continue

            event = Event.objects.create(
                name=event_name,
                start_date=start_date,
                end_date=datetime.strptime(row.get('End Date: ', ''), "%m/%d/%Y").date() if row.get('End Date: ') else None,
                start_time = datetime.strptime(row.get('Start Time: ', ''), "%I:%M:%S %p").time() if row.get('Start Time: ') else None,
                end_time = datetime.strptime(row.get('End Time:', ''), "%I:%M:%S %p").time() if row.get('End Time:') else None,
                description=row.get('Event Description', ''),
                host=row.get('Host: ', ''),
                status='Pending'
            )

            # Add budget items
            for i in range(1, 21):
                item_name = row.get(f'Item {i} Name')
                quantity = row.get(f'Item {i} Quantity ')
                price = row.get(f'Item {i} Price')
                total = row.get(f'Total Price for item {i}')

                if item_name and total:
                    Budget.objects.create(
                        item_name=item_name,
                        item_quantity=int(quantity) if quantity else 1,
                        item_cost=float(price) if price else 0.0,
                        total_cost=float(total),
                        budget_status='Pending',
                        event=event
                    )

            new_events += 1

        self.stdout.write(self.style.SUCCESS(f'Imported {new_events} new events. Skipped {skipped} duplicates.'))
