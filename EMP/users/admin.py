from django.contrib import admin

from .models import User
from .models import UserProfile

# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ("first_name", "last_name", "email", "phone", "department")

# Inline display of profile on user page
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(admin.ModelAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_department', 'get_phone')

    def get_department(self, obj):
        return obj.profile.department if hasattr(obj, 'profile') else '-'
    get_department.short_description = 'Department'

    def get_phone(self, obj):
        return obj.profile.phone if hasattr(obj, 'profile') else '-'
    get_phone.short_description = 'Phone'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)