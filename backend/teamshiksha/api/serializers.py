from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
import re

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'password']

    # Validate email uniqueness
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    # Optional: password complexity
    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters.")
        # check for uppercase, lowercase, number
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least 1 uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least 1 lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least 1 number.")
        return value

    def create(self, validated_data):
        email = validated_data['email']

        # Auto-generate username from email
        base_username = email.split("@")[0]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        # map email to username
        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")

        attrs["user"] = user
        return attrs



class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for /api/auth/me/:
    - editable: first_name, last_name
    - read-only: email, username, id
    """
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField(read_only=True)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        read_only_fields = ("id", "username", "email") 