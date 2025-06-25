import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from django.core.exceptions import ObjectDoesNotExist
import json
from django.core.mail import EmailMessage
from django.conf import settings
# Simulated OTP store
OTP_STORE = {}

class OTPLoginView(APIView):
     def post(self, request):
        try:
            data = request.data
            if isinstance(data, str):  # manually parse if it's a string
                data = json.loads(data)
        except Exception as e:
            return Response({"detail": f"Invalid JSON: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        email = data.get("email")
        otp = data.get("otp")

        if not email:
            return Response({"detail": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if not otp:
            generated_otp = str(random.randint(100000, 999999))
            OTP_STORE[email] = generated_otp
            subject = "Your AURAK Event Platform OTP"
            message = f"Your OTP is: <strong>{generated_otp}</strong>"
            email_message = EmailMessage(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [email]
            )
            email_message.content_subtype = "html"  # to enable bold formatting
            try:
                email_message.send()
                return Response({"detail": f"OTP sent to {email}"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"detail": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if OTP_STORE.get(email) != otp:
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        profile = getattr(user, "userprofile", None)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "department": profile.department if profile else "",
                "phone": profile.phone if profile else "",
            }
        }, status=status.HTTP_200_OK)