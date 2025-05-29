from django.contrib import admin
from .models import Event, EventTag, UserEvent

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date", "status", "host")

@admin.register(EventTag)
class EventTagAdmin(admin.ModelAdmin):
    list_display = ("event", "tag")

@admin.register(UserEvent)
class UserEventAdmin(admin.ModelAdmin):
    list_display = ("user", "event")
