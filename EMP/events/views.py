from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Event
from .serializers import EventSerializer
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


def normalize_department(dept):
    return dept.lower().replace('&', 'and').replace('  ', ' ').strip()

DEPARTMENT_ADMINS = {
    "hazimgamer101@gmail.com": normalize_department("Department of Management"),
    # Add others as needed
}

ULTIMATE_ADMINS = [
    "student.life@aurak.ac.ae",
    "qutaiba.raid@gmail.com",
]
# Optional: Replace with Django Group-based permissions later
PRIVILEGED_EMAILS = [
    # "2023005883@aurak.ac.ae",
    # "Imad.hoballah@aurak.ac.ae",
    # "qutaiba.raid@gmail.com"
]

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # Require login

    def get_queryset(self):
        user = self.request.user
        email = user.email.lower().strip()
        print("User Email:", email)
        print("Department Admin Of:", DEPARTMENT_ADMINS.get(email))
        print("Events Returned:", Event.objects.filter(department__icontains=DEPARTMENT_ADMINS.get(email, "")).values_list("name", flat=True))

        if user.is_superuser or email in ULTIMATE_ADMINS or email in PRIVILEGED_EMAILS:
            return Event.objects.all()

        if email in DEPARTMENT_ADMINS:
            admin_dept = DEPARTMENT_ADMINS[email]
            return Event.objects.filter(department__isnull=False).filter(
                department__icontains=admin_dept
            )

        return Event.objects.filter(creator=user)


    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

@csrf_exempt
def notify_chair(request):
    if request.method == "POST":
        data = json.loads(request.body)
        to_email = data.get("to")
        event_name = data.get("eventName")
        department = data.get("department")
        submitted_by = data.get("submittedBy")
        submitted_email = data.get("submittedEmail")

        if to_email:
            subject = f"New Event Submission for {department}"
            message = (
                f"A new event titled '{event_name}' has been submitted by {submitted_by} ({submitted_email}).\n\n"
                f"Please log in to the platform to review it."
            )
            send_mail(subject, message, "noreply@aurak-events.com", [to_email])
            return JsonResponse({"message": "Email sent"}, status=200)
        return JsonResponse({"error": "Missing email"}, status=400)
