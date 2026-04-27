from django.contrib import admin
from .models import Medicament


@admin.register(Medicament)
class MedicamentAdmin(admin.ModelAdmin):
    """
    Configuration de l'interface d'administration des médicaments.
    """

    list_display = (
        "nom",
        "categorie",
        "forme",
        "dosage",
        "prix_vente",
        "stock_actuel",
        "stock_minimum",
        "ordonnance_requise",
        "est_actif",
    )
    list_filter = ("categorie", "ordonnance_requise", "est_actif")
    search_fields = ("nom", "dci", "dosage", "forme")
    ordering = ("nom",)