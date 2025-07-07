from rest_framework import generics
from .models import Attendance
from .serializers import AttendanceSerializer

class AttendeeCreateView(generics.CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
