from rest_framework.routers import DefaultRouter
from .views import CategorieViewSet

router = DefaultRouter()
router.register(r"", CategorieViewSet, basename="categories")

urlpatterns = router.urls