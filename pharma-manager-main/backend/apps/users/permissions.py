from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsDoctorAdmin(BasePermission):
    """Grants access only to users with the DoctorAdmin role."""

    message = "Accès réservé aux administrateurs."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_doctor_admin
        )


class IsCaissier(BasePermission):
    """Grants access only to users with the Caissier role."""

    message = "Accès réservé aux caissiers."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.is_caissier
        )


class IsDoctorAdminOrCaissier(BasePermission):
    """Grants access to both DoctorAdmin and Caissier roles."""

    message = "Authentification requise."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("DoctorAdmin", "Caissier")
        )


class IsDoctorAdminOrReadOnly(BasePermission):
    """
    Safe methods (GET, HEAD, OPTIONS) → both roles allowed.
    Write methods (POST, PUT, PATCH, DELETE) → DoctorAdmin only.

    Used for Medicaments: Caissier can view but not modify.
    """

    message = "Modification réservée aux administrateurs."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return request.user.role in ("DoctorAdmin", "Caissier")
        return request.user.is_doctor_admin
