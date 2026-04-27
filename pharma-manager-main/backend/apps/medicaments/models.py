from django.db import models


class Medicament(models.Model):
    """
    Représente un médicament dans l'inventaire de la pharmacie.

    Attributs:
        nom (str): Nom commercial du médicament.
        dci (str): Dénomination Commune Internationale.
        categorie (Categorie): Catégorie du médicament.
        forme (str): Forme galénique.
        dosage (str): Dosage du médicament.
        prix_achat (Decimal): Prix d'achat unitaire.
        prix_vente (Decimal): Prix de vente public.
        stock_actuel (int): Quantité disponible.
        stock_minimum (int): Seuil d'alerte.
        date_expiration (date): Date de péremption.
        ordonnance_requise (bool): Indique si une ordonnance est requise.
        date_creation (datetime): Horodatage de création.
        est_actif (bool): Soft delete.
    """

    nom = models.CharField(max_length=200,unique=True)
    dci = models.CharField(max_length=200)
    categorie = models.ForeignKey(
        "categories.Categorie",
        on_delete=models.PROTECT,
        related_name="medicaments",
    )
    forme = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100)
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2)
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2)
    stock_actuel = models.PositiveIntegerField(default=0)
    stock_minimum = models.PositiveIntegerField(default=0)
    date_expiration = models.DateField()
    ordonnance_requise = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    est_actif = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Médicament"
        verbose_name_plural = "Médicaments"
        ordering = ["nom"]

    def __str__(self) -> str:
        return f"{self.nom} ({self.dosage})"

    @property
    def est_en_alerte(self) -> bool:
        """Retourne True si le stock actuel est inférieur ou égal au stock minimum."""
        return self.stock_actuel <= self.stock_minimum