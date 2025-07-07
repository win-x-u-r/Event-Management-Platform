from django.urls import path
from .views import AttendeeCreateView

urlpatterns = [
    path('register/', AttendeeCreateView.as_view(), name='attendee-register'),
]
