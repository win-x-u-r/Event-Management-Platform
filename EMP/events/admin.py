from django.contrib import admin
from .models import Event
from budget.models import Budget
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect, get_object_or_404
from django.contrib import messages
from django.urls import reverse

from django.urls import reverse

class BudgetInline(admin.TabularInline):
    model = Budget
    extra = 0
    readonly_fields = ('change_status',)

    def change_status(self, obj):
        if obj.pk:
            grant_url = reverse('admin:grant_budget', args=[obj.pk])
            deny_url = reverse('admin:deny_budget', args=[obj.pk])
            return format_html(
                '<a class="button" style="margin-right:5px;" href="{}">✅ Grant</a>'
                '<a class="button" style="color:red;" href="{}">❌ Deny</a>',
                grant_url, deny_url
            )
        return ""
    change_status.short_description = "Actions"


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'host', 'start_date', 'status', 'category', 'department')
    list_filter = ('status', 'department', 'category')
    search_fields = ('name', 'host', 'department', 'category')
    inlines = [BudgetInline]

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('budget/grant/<int:budget_id>/', self.admin_site.admin_view(self.grant_budget), name='grant_budget'),
            path('budget/deny/<int:budget_id>/', self.admin_site.admin_view(self.deny_budget), name='deny_budget'),
        ]
        return custom_urls + urls

    def grant_budget(self, request, budget_id):
        budget = get_object_or_404(Budget, pk=budget_id)
        budget.budget_status = "Granted"
        budget.save()
        messages.success(request, f"Budget '{budget}' marked as GRANTED.")
        return redirect(request.META.get('HTTP_REFERER', '/admin/'))

    def deny_budget(self, request, budget_id):
        budget = get_object_or_404(Budget, pk=budget_id)
        budget.budget_status = "Denied"
        budget.save()
        messages.success(request, f"Budget '{budget}' marked as DENIED.")
        return redirect(request.META.get('HTTP_REFERER', '/admin/'))
