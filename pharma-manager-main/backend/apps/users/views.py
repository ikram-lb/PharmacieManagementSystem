from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.users.permissions import IsDoctorAdmin

from apps.users.userserializer import (
    CreateCaissierSerializer,
    UpdateCaissierSerializer,
    UserSerializer,
)

from apps.users.customjwttokenserializer import (
    CustomTokenObtainPairSerializer,
)

User = get_user_model()


# ── Auth ──────────────────────────────────────────────────────

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/token/
    Returns access + refresh tokens with role embedded in the payload.
    """
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    """
    GET /api/users/me/
    Returns the currently authenticated user's profile.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ── Caissier management (DoctorAdmin only) ────────────────────

class CaissierListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/users/caissiers/   → list all caissier accounts
    POST /api/users/caissiers/   → create a new caissier account
    Both restricted to DoctorAdmin.
    """
    permission_classes = [IsDoctorAdmin]
    serializer_class = CreateCaissierSerializer

    def get_queryset(self):
        return User.objects.filter(role=User.Role.CAISSIER).order_by("username")

    def get_serializer_class(self):
        if self.request.method == "GET":
            return UserSerializer
        return CreateCaissierSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class CaissierDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/users/caissiers/<id>/  → get caissier detail
    PUT    /api/users/caissiers/<id>/  → full update
    PATCH  /api/users/caissiers/<id>/  → partial update / reset password
    DELETE /api/users/caissiers/<id>/  → delete
    All restricted to DoctorAdmin.
    """
    permission_classes = [IsDoctorAdmin]

    def get_queryset(self):
        return User.objects.filter(role=User.Role.CAISSIER)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return UserSerializer
        return UpdateCaissierSerializer

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()  
        return Response(
            {"detail": "Compte caissier supprimé."},
            status=status.HTTP_204_NO_CONTENT,
        )
