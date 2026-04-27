from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CaissierDetailView,
    CaissierListCreateView,
    CustomTokenObtainPairView,
    MeView,
)

urlpatterns = [
    # Auth
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Current user profile
    path("users/me/", MeView.as_view(), name="user_me"),

    # Caissier management (DoctorAdmin only)
    path("users/caissiers/", CaissierListCreateView.as_view(), name="caissier_list_create"),
    path("users/caissiers/<int:pk>/", CaissierDetailView.as_view(), name="caissier_detail"),
]
