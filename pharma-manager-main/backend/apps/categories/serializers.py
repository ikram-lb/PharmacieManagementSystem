from rest_framework import serializers
from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Categorie.

    Permet la création, modification et lecture des catégories
    de médicaments.
    """

    nb_medicaments = serializers.IntegerField(read_only=True)
    quantite_totale = serializers.IntegerField(read_only=True)

    class Meta:
        model = Categorie
        fields ="__all__"

    

    def validate_nom(self, value):
        """
        Vérifie que le nom de la catégorie n'est pas vide.
        """
        if not value.strip():
            raise serializers.ValidationError(
                "Le nom de la catégorie ne peut pas être vide."
            )
        return value
        