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
    list_display = ('name', 'start_date', 'end_date', 'host', 'status')
    search_fields = ('name', 'host')
    list_filter = ('status', 'start_date')
    inlines = [BudgetInline]  # shows budget items inline in the event admin

@admin.register(EventTag)
class EventTagAdmin(admin.ModelAdmin):
    list_display = ("event", "tag")

@admin.register(UserEvent)
class UserEventAdmin(admin.ModelAdmin):
    list_display = ("user", "event")
