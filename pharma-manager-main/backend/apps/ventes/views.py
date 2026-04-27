from django.db import transaction
from django.utils import timezone
from drf_spectacular.utils import OpenApiExample, extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.permissions import IsDoctorAdminOrCaissier

from .models import Vente
from .serializers import VenteSerializer


@extend_schema(tags=["Ventes"])
class VenteViewSet(viewsets.ModelViewSet):
    """
    API de gestion des ventes.
    Permet de créer une vente, consulter l'historique,
    voir le détail et annuler une vente avec réintégration du stock.
    """

    serializer_class = VenteSerializer
    permission_classes = [IsDoctorAdminOrCaissier]
    http_method_names = ["get", "post", "head", "options"]

    # No filterset_fields — we handle everything manually in get_queryset
    # so we have full control and avoid silent mismatches.

    def get_queryset(self):
        """
        Retourne l'historique des ventes avec filtres optionnels :
          - date_debut / date_fin  : plage de dates (YYYY-MM-DD)
          - statut                 : COMPLETEE | ANNULEE
        """
        queryset = (
            Vente.objects.prefetch_related("lignes", "lignes__medicament").all()
        )

        params = self.request.query_params

        # ── Date range ──────────────────────────────────────────
        date_debut = params.get("date_debut")
        date_fin = params.get("date_fin")

        if date_debut:
            queryset = queryset.filter(date_vente__date__gte=date_debut)
        if date_fin:
            queryset = queryset.filter(date_vente__date__lte=date_fin)

        # ── Statut ──────────────────────────────────────────────
        statut = params.get("statut")
        valid_statuts = [s.value for s in Vente.Statut]

        # Only apply filter if value is a known statut — ignore "All", None, etc.
        if statut and statut in valid_statuts:
            queryset = queryset.filter(statut=statut)

        return queryset

    @extend_schema(
        description=(
            "Crée une nouvelle vente avec un ou plusieurs articles "
            "et déduit automatiquement le stock."
        ),
        examples=[
            OpenApiExample(
                "Exemple de création de vente",
                value={
                    "notes": "Vente comptoir",
                    "lignes": [
                        {"medicament": 1, "quantite": 2},
                        {"medicament": 3, "quantite": 1},
                    ],
                },
                request_only=True,
            )
        ],
    )
    def create(self, request, *args, **kwargs):
        """
        Crée une nouvelle vente.
        """
        return super().create(request, *args, **kwargs)

    @transaction.atomic
    @extend_schema(
        description=(
            "Annule une vente et réintègre automatiquement les quantités en stock."
        ),
        responses={200: VenteSerializer},
    )
    @action(detail=True, methods=["post"], url_path="annuler")
    def annuler(self, request, pk=None):
        """
        Annule une vente complétée et réintègre les stocks.
        """
        vente = self.get_object()

        if vente.statut == Vente.Statut.ANNULEE:
            return Response(
                {"detail": "Cette vente est déjà annulée."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for ligne in vente.lignes.select_related("medicament").all():
            medicament = ligne.medicament
            medicament.stock_actuel += ligne.quantite
            medicament.save(update_fields=["stock_actuel"])

        vente.statut = Vente.Statut.ANNULEE
        vente.est_actif = False
        vente.save(update_fields=["statut", "est_actif"])

        serializer = self.get_serializer(vente)
        return Response(serializer.data, status=status.HTTP_200_OK)