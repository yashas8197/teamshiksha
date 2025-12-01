from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer
from django.contrib.auth.models import User

# ---------------- Register ------------------

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Optionally, return access & refresh tokens immediately
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


# ---------------- Login ----------------------

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })


# ---------------- Current User ----------------------

class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET: return current authenticated user's profile
    PUT/PATCH: allow editing only first_name and last_name.
               email is strictly read-only and ignored if provided.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        # Return the current logged-in user instance
        return self.request.user

    def update(self, request, *args, **kwargs):
        # Defensive: prevent email updates even if client includes it.
        data = request.data.copy()
        if "email" in data:
            data.pop("email", None)

        # Only allow first_name/last_name to be part of validated data.
        allowed_keys = {"first_name", "last_name"}
        sanitized = {k: v for k, v in data.items() if k in allowed_keys}

        # Partial update support (PATCH)
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=sanitized, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Return the fresh serialized user object (read-only fields included)
        return Response(serializer.data, status=status.HTTP_200_OK)
