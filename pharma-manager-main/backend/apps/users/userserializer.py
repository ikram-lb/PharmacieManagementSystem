from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Read-only representation of a user (used in /me and user list)."""

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role"]
        read_only_fields = fields


class CreateCaissierSerializer(serializers.ModelSerializer):
    """
    Used by DoctorAdmin to create a new Caissier account.
    Password is write-only and hashed before saving.
    """

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            role=User.Role.CAISSIER,
            **validated_data,
        )


class UpdateCaissierSerializer(serializers.ModelSerializer):
    """
    DoctorAdmin can update basic info and reset the password.
    Password field is optional on update.
    """

    password = serializers.CharField(write_only=True, min_length=8, required=False)

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "password"]

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
