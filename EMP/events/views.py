from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Event
from .serializers import EventSerializer

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
        if user.is_superuser or user.email in PRIVILEGED_EMAILS:
            return Event.objects.all()
        return Event.objects.filter(creator=user)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
