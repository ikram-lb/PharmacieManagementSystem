from django.contrib import admin
from .models import Categorie


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    """
    Configuration de l'interface admin pour les catégories.
    """

    list_display = ("nom", "date_creation")
    search_fields = ("nom",)
    ordering = ("nom",)