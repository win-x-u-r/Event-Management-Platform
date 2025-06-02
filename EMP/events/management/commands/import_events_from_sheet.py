from django.core.management.base import BaseCommand
from events.models import Event
from utils.google_sheets import fetch_event_data

class Command(BaseCommand):
    help = 'Import events from Google Sheet'
    
    def handle(self, *args, **kwargs):
        data = fetch_event_data()
        for row in data:
            Event.objects.create(
                name=row['Event Name'],
                description=row['Event Description'],
                start_date=row['Event Start Date'],
                end_date=row['Event End Date'],
                start_time=row['Start Time'],
                end_time=row['End Time'],
                host=row['Event Host'],
                status=row['Event Status']
            )
        self.stdout.write(self.style.SUCCESS('Imported events from Google Sheet!'))
