from decimal import Decimal
from django.db import models


class Vente(models.Model):
    """
    Représente une transaction de vente en pharmacie.
    """

    class Statut(models.TextChoices):
        COMPLETEE = "COMPLETEE", "Complétée"
        ANNULEE = "ANNULEE", "Annulée"

    reference = models.CharField(max_length=30, unique=True)
    date_vente = models.DateTimeField(auto_now_add=True)
    total_ttc = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    statut = models.CharField(max_length=20, choices=Statut.choices, default=Statut.COMPLETEE)
    notes = models.TextField(blank=True)
    est_actif = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Vente"
        verbose_name_plural = "Ventes"
        ordering = ["-date_vente"]

    def __str__(self) -> str:
        return self.reference


class LigneVente(models.Model):
    """
    Représente une ligne de détail d'une vente.
    """

    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name="lignes")
    medicament = models.ForeignKey(
        "medicaments.Medicament",
        on_delete=models.PROTECT,
        related_name="lignes_vente",
    )
    quantite = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    sous_total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = "Ligne de vente"
        verbose_name_plural = "Lignes de vente"

    def __str__(self) -> str:
        return f"{self.vente.reference} - {self.medicament.nom}"