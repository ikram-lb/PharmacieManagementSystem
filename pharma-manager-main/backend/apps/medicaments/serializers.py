from rest_framework import serializers
from .models import Medicament


class MedicamentSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle Medicament.

    Gère la validation des données lors de la création,
    la modification et la lecture d'un médicament.
    """

    est_en_alerte = serializers.ReadOnlyField()
    categorie_nom = serializers.CharField(source="categorie.nom", read_only=True)

    class Meta:
        model = Medicament
        fields = [
            "id",
            "nom",
            "dci",
            "categorie",
            "categorie_nom",
            "forme",
            "dosage",
            "prix_achat",
            "prix_vente",
            "stock_actuel",
            "stock_minimum",
            "date_expiration",
            "ordonnance_requise",
            "date_creation",
            "est_actif",
            "est_en_alerte",
        ]
        read_only_fields = [
            "id",
            "date_creation",
            "est_en_alerte",
            "categorie_nom",
        ]

    def validate_nom(self, value):
        """
        Vérifie que le nom commercial n'est pas vide.
        """
        if not value.strip():
            raise serializers.ValidationError(
                "Le nom du médicament ne peut pas être vide."
            )
        return value

    def validate_dci(self, value):
        """
        Vérifie que la DCI n'est pas vide.
        """
        if not value.strip():
            raise serializers.ValidationError(
                "La DCI ne peut pas être vide."
            )
        return value

    def validate(self, attrs):
        """
        Validation globale des données métier.
        """
        prix_achat = attrs.get("prix_achat", getattr(self.instance, "prix_achat", None))
        prix_vente = attrs.get("prix_vente", getattr(self.instance, "prix_vente", None))
        stock_actuel = attrs.get("stock_actuel", getattr(self.instance, "stock_actuel", 0))
        stock_minimum = attrs.get("stock_minimum", getattr(self.instance, "stock_minimum", 0))

        if prix_achat is not None and prix_achat < 0:
            raise serializers.ValidationError(
                {"prix_achat": "Le prix d'achat doit être positif ou nul."}
            )

        if prix_vente is not None and prix_vente < 0:
            raise serializers.ValidationError(
                {"prix_vente": "Le prix de vente doit être positif ou nul."}
            )

        if (
            prix_achat is not None
            and prix_vente is not None
            and prix_vente < prix_achat
        ):
            raise serializers.ValidationError(
                {"prix_vente": "Le prix de vente doit être supérieur ou égal au prix d'achat."}
            )

        if stock_actuel is not None and stock_actuel < 0:
            raise serializers.ValidationError(
                {"stock_actuel": "Le stock actuel doit être positif ou nul."}
            )

        if stock_minimum is not None and stock_minimum < 0:
            raise serializers.ValidationError(
                {"stock_minimum": "Le stock minimum doit être positif ou nul."}
            )

        return attrs