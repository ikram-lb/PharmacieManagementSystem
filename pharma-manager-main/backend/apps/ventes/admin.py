from django.contrib import admin
from .models import LigneVente, Vente


class LigneVenteInline(admin.TabularInline):
    model = LigneVente
    extra = 0
    readonly_fields = ("medicament", "quantite", "prix_unitaire", "sous_total")


@admin.register(Vente)
class VenteAdmin(admin.ModelAdmin):
    """
    Configuration de l'administration des ventes.
    """

    list_display = ("reference", "date_vente", "total_ttc", "statut", "est_actif")
    list_filter = ("statut", "date_vente", "est_actif")
    search_fields = ("reference", "notes")
    ordering = ("-date_vente",)
    inlines = [LigneVenteInline]