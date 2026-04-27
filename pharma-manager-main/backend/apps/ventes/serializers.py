from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.medicaments.models import Medicament
from .models import LigneVente, Vente


class LigneVenteWriteSerializer(serializers.Serializer):
    """
    Serializer d'écriture pour une ligne de vente.
    """

    medicament = serializers.PrimaryKeyRelatedField(
        queryset=Medicament.objects.filter(est_actif=True)
    )
    quantite = serializers.IntegerField(min_value=1)

    def validate_medicament(self, value):
        """
        Vérifie que le médicament est actif.
        """
        if not value.est_actif:
            raise serializers.ValidationError(
                "Ce médicament est inactif et ne peut pas être vendu."
            )
        return value


class LigneVenteReadSerializer(serializers.ModelSerializer):
    """
    Serializer de lecture pour une ligne de vente.
    """

    medicament_nom = serializers.CharField(source="medicament.nom", read_only=True)
    medicament_dosage = serializers.CharField(source="medicament.dosage", read_only=True)

    class Meta:
        model = LigneVente
        fields = [
            "id",
            "medicament",
            "medicament_nom",
            "medicament_dosage",
            "quantite",
            "prix_unitaire",
            "sous_total",
        ]


class VenteSerializer(serializers.ModelSerializer):
    """
    Serializer pour la création et la lecture des ventes.
    """

    lignes = LigneVenteWriteSerializer(many=True, write_only=True)
    lignes_detail = LigneVenteReadSerializer(source="lignes", many=True, read_only=True)

    class Meta:
        model = Vente
        fields = [
            "id",
            "reference",
            "date_vente",
            "total_ttc",
            "statut",
            "notes",
            "est_actif",
            "lignes",
            "lignes_detail",
        ]
        read_only_fields = [
            "id",
            "reference",
            "date_vente",
            "total_ttc",
            "statut",
            "est_actif",
            "lignes_detail",
        ]

    def validate_lignes(self, value):
        """
        Vérifie qu'une vente contient au moins une ligne.
        """
        if not value:
            raise serializers.ValidationError(
                "Une vente doit contenir au moins un article."
            )
        return value

    def _generate_reference(self):
        """
        Génère une référence unique de vente au format VNT-YYYY-XXXX.
        """
        year = timezone.now().year
        prefix = f"VNT-{year}-"

        last_sale = (
            Vente.objects.filter(reference__startswith=prefix)
            .order_by("-id")
            .first()
        )

        if last_sale and last_sale.reference:
            try:
                last_number = int(last_sale.reference.split("-")[-1])
            except (ValueError, IndexError):
                last_number = 0
        else:
            last_number = 0

        new_number = last_number + 1
        return f"{prefix}{new_number:04d}"

    @transaction.atomic
    def create(self, validated_data):
        """
        Crée une vente, déduit le stock, enregistre les lignes
        et calcule le total TTC.
        """
        lignes_data = validated_data.pop("lignes")

        vente = Vente.objects.create(
            reference=self._generate_reference(),
            notes=validated_data.get("notes", ""),
            statut=Vente.Statut.COMPLETEE,
            est_actif=True,
        )

        total_ttc = Decimal("0.00")

        for ligne_data in lignes_data:
            medicament = Medicament.objects.select_for_update().get(
                pk=ligne_data["medicament"].pk
            )
            quantite = ligne_data["quantite"]

            if not medicament.est_actif:
                raise serializers.ValidationError(
                    {"medicament": f"Le médicament '{medicament.nom}' est inactif."}
                )

            if medicament.stock_actuel < quantite:
                raise serializers.ValidationError(
                    {
                        "stock": (
                            f"Stock insuffisant pour '{medicament.nom}'. "
                            f"Stock disponible: {medicament.stock_actuel}, "
                            f"quantité demandée: {quantite}."
                        )
                    }
                )

            prix_unitaire = medicament.prix_vente
            sous_total = Decimal(quantite) * prix_unitaire

            LigneVente.objects.create(
                vente=vente,
                medicament=medicament,
                quantite=quantite,
                prix_unitaire=prix_unitaire,
                sous_total=sous_total,
            )

            medicament.stock_actuel -= quantite
            medicament.save(update_fields=["stock_actuel"])

            total_ttc += sous_total

        vente.total_ttc = total_ttc
        vente.save(update_fields=["total_ttc"])

        return vente