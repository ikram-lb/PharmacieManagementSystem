from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model with a role field.
    DoctorAdmin : full access + can manage Caissier accounts.
    Caissier    : ventes + read-only medicaments + dashboard.
    """

    class Role(models.TextChoices):
        DOCTOR_ADMIN = "DoctorAdmin", "Doctor Admin"
        CAISSIER = "Caissier", "Caissier"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CAISSIER,
    )

    # Convenience properties — use these in permission classes
    @property
    def is_doctor_admin(self) -> bool:
        return self.role == self.Role.DOCTOR_ADMIN

    @property
    def is_caissier(self) -> bool:
        return self.role == self.Role.CAISSIER

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"
