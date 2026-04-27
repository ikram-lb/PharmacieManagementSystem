from django.db import models

class Categorie(models.Model):
    """
    Représente une catégorie de médicaments.

    Attributs:
        nom (str): Nom de la catégorie.
        description (str): Description optionnelle de la catégorie.
        date_creation (datetime): Date de création de l'enregistrement.
    """

    nom = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["nom"]

    def __str__(self) -> str:
        return self.nom
