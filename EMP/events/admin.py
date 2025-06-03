from django.contrib import admin
from .models import Event, EventTag, UserEvent
from budget.models import Budget

class BudgetInline(admin.TabularInline):  # or StackedInline
    model = Budget
    extra = 0  # no extra empty forms by default
    fields = ('item_name', 'item_quantity', 'item_cost', 'total_cost', 'budget_status')
    readonly_fields = ()  # add any readonly fields here if needed

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'host', 'start_date', 'end_date', 'venue', 'location', 'category', 'department', 'status')
    search_fields = ('name', 'host', 'department', 'category')
    list_filter = ('status', 'department', 'category', 'start_date')

    # This controls the fields shown when viewing/editing a specific event
    fields = (
        'name', 'description', 'host', 'venue', 'location', 'category', 'department',
        'start_date', 'end_date', 'start_time', 'end_time', 'status'
    )

    inlines = [BudgetInline]
@admin.register(EventTag)
class EventTagAdmin(admin.ModelAdmin):
    list_display = ("event", "tag")

@admin.register(UserEvent)
class UserEventAdmin(admin.ModelAdmin):
    list_display = ("user", "event")
