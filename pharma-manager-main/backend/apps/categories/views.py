from rest_framework import viewsets
from drf_spectacular.utils import extend_schema
from .models import Categorie
from .serializers import CategorieSerializer
from django.db.models import Count, Sum 
from apps.users.permissions import IsDoctorAdmin

@extend_schema(tags=["Catégories"])
class CategorieViewSet(viewsets.ModelViewSet):
    """
    API permettant la gestion des catégories de médicaments.

    Endpoints disponibles :
    - GET /categories/
    - POST /categories/
    - GET /categories/{id}/
    - PUT/PATCH /categories/{id}/
    - DELETE /categories/{id}/
    """

    serializer_class = CategorieSerializer
    permission_classes = [IsDoctorAdmin]

    def get_queryset(self):
       return Categorie.objects.annotate(
              nb_medicaments=Count("medicaments"),
              quantite_totale=Sum("medicaments__stock_actuel")
    )