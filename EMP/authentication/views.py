import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from django.core.exceptions import ObjectDoesNotExist
import json
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
            print(f"[DEBUG] OTP for {email} is {generated_otp}")
            return Response({"detail": f"OTP sent to {email} (check console)"}, status=status.HTTP_200_OK)

        if OTP_STORE.get(email) != otp:
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "department": user.department,
                "email": user.email,
                "phone": user.phone,
            }
        }, status=status.HTTP_200_OK)