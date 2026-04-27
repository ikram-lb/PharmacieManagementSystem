from django.db.models import F
from drf_spectacular.utils import extend_schema, OpenApiExample
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
import csv
from .models import Medicament
from .serializers import MedicamentSerializer
from apps.users.permissions import IsDoctorAdminOrReadOnly


@extend_schema(tags=["Medicaments"])
class MedicamentViewSet(viewsets.ModelViewSet):
    """
    API de gestion des médicaments.

    Fournit les opérations CRUD, la recherche, le filtrage
    et un endpoint spécifique pour les alertes de stock bas.
    """

    serializer_class = MedicamentSerializer
    permission_classes = [IsDoctorAdminOrReadOnly]
    filterset_fields = ["categorie", "ordonnance_requise"]
    search_fields = ["nom", "dci", "forme", "dosage"]
    ordering_fields = ["nom", "prix_vente", "stock_actuel", "date_expiration", "date_creation"]
    ordering = ["nom"]

    def get_queryset(self):
        """
        Retourne les médicaments actifs avec filtres métier optionnels.
        """
        queryset = Medicament.objects.filter(est_actif=True).select_related("categorie")

        est_en_alerte = self.request.query_params.get("est_en_alerte")
        if est_en_alerte is not None:
            est_en_alerte = est_en_alerte.lower()
            if est_en_alerte == "true":
                queryset = queryset.filter(stock_actuel__lte=F("stock_minimum"))
            elif est_en_alerte == "false":
                queryset = queryset.filter(stock_actuel__gt=F("stock_minimum"))

        return queryset

    def perform_destroy(self, instance):
        """
        Effectue un soft delete en désactivant le médicament.
        """
        instance.est_actif = False
        instance.save(update_fields=["est_actif"])

    @extend_schema(
        description="Retourne la liste des médicaments actifs dont le stock actuel est inférieur ou égal au stock minimum.",
        responses={200: MedicamentSerializer(many=True)},
        examples=[
            OpenApiExample(
                "Exemple de réponse",
                value=[
                    {
                        "id": 1,
                        "nom": "Amoxicilline",
                        "dci": "Amoxicilline",
                        "categorie": 1,
                        "categorie_nom": "Antibiotique",
                        "forme": "Comprimé",
                        "dosage": "500mg",
                        "prix_achat": "12.50",
                        "prix_vente": "18.00",
                        "stock_actuel": 5,
                        "stock_minimum": 10,
                        "date_expiration": "2027-05-31",
                        "ordonnance_requise": True,
                        "date_creation": "2026-03-12T10:00:00Z",
                        "est_actif": True,
                        "est_en_alerte": True,
                    }
                ],
                response_only=True,
            )
        ],
    )
    @action(detail=False, methods=["get"], url_path="alertes")
    def alertes(self, request):
        """
        Retourne les médicaments en alerte de stock.
        """
        queryset = self.get_queryset().filter(stock_actuel__lte=F("stock_minimum"))
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    @extend_schema(
    description="Exporte l'inventaire des médicaments actifs au format CSV.",
    responses={200: {"type": "string", "format": "binary"}},
    )
    @action(detail=False, methods=["get"], url_path="export-csv")
    def export_csv(self, request):
        """
        Exporte la liste des médicaments actifs en CSV.
        """
        queryset = self.filter_queryset(self.get_queryset())

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="medicaments.csv"'

        writer = csv.writer(response)
        writer.writerow(
            [
                "ID",
                "Nom",
                "DCI",
                "Categorie",
                "Forme",
                "Dosage",
                "Prix achat",
                "Prix vente",
                "Stock actuel",
                "Stock minimum",
                "Date expiration",
                "Ordonnance requise",
                "En alerte",
            ]
        )

        for medicament in queryset:
            writer.writerow(
                [
                    medicament.id,
                    medicament.nom,
                    medicament.dci,
                    medicament.categorie.nom,
                    medicament.forme,
                    medicament.dosage,
                    medicament.prix_achat,
                    medicament.prix_vente,
                    medicament.stock_actuel,
                    medicament.stock_minimum,
                    medicament.date_expiration,
                    "Oui" if medicament.ordonnance_requise else "Non",
                    "Oui" if medicament.est_en_alerte else "Non",
                ]
            )

        return response