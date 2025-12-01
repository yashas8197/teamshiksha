import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from api.serializers import RegisterSerializer

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def create_user():
    def make_user(email="test@example.com", password="Password123"):
        user = User.objects.create_user(
            username=email.split("@")[0],
            email=email,
            password=password,
            first_name="Test",
            last_name="User"
        )
        return user
    return make_user

# ---------------- Register Tests ----------------

@pytest.mark.django_db
def test_register_success(api_client):
    url = reverse("register")  # your urls.py should have name='register'
    data = {
        "email": "newuser@example.com",
        "password": "Password123"
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data["user"]["email"] == "newuser@example.com"

@pytest.mark.django_db
def test_register_duplicate_email(api_client, create_user):
    create_user(email="duplicate@example.com")
    url = reverse("register")
    data = {
        "email": "duplicate@example.com",
        "password": "Password123"
    }
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data

# ---------------- Login Tests ----------------

@pytest.mark.django_db
def test_login_success(api_client, create_user):
    user = create_user()
    url = reverse("login")  # your urls.py should have name='login'
    data = {"email": user.email, "password": "Password123"}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data["user"]["email"] == user.email

@pytest.mark.django_db
def test_login_wrong_password(api_client, create_user):
    user = create_user()
    url = reverse("login")
    data = {"email": user.email, "password": "WrongPass123"}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

# ---------------- Profile Tests ----------------

@pytest.mark.django_db
def test_get_profile_authenticated(api_client, create_user):
    user = create_user()
    api_client.force_authenticate(user=user)
    url = reverse("me")  # your urls.py should have name='profile'
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["email"] == user.email

@pytest.mark.django_db
def test_get_profile_unauthenticated(api_client):
    url = reverse("me")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_update_profile_first_last_name(api_client, create_user):
    user = create_user()
    api_client.force_authenticate(user=user)
    url = reverse("me")
    data = {"first_name": "Updated", "last_name": "Name", "email": "hacker@example.com"}
    response = api_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK
    # Email should not change
    assert response.data["email"] == user.email
    assert response.data["first_name"] == "Updated"
    assert response.data["last_name"] == "Name"

@pytest.mark.django_db
def test_update_profile_unauthenticated(api_client):
    url = reverse("me")
    data = {"first_name": "NoAuth"}
    response = api_client.patch(url, data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_password_too_short():
    data = {"email": "short@example.com", "password": "Ab1"}
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert "password" in serializer.errors

@pytest.mark.django_db
def test_password_missing_uppercase():
    data = {"email": "noupper@example.com", "password": "password1"}
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert "password" in serializer.errors
    assert any("uppercase" in str(e) for e in serializer.errors["password"])

@pytest.mark.django_db
def test_password_missing_lowercase():
    data = {"email": "nolower@example.com", "password": "PASSWORD1"}
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert "password" in serializer.errors
    assert any("lowercase" in str(e) for e in serializer.errors["password"])

@pytest.mark.django_db
def test_password_missing_number():
    data = {"email": "nonumber@example.com", "password": "Password"}
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert "password" in serializer.errors
    assert any("number" in str(e) for e in serializer.errors["password"])

@pytest.mark.django_db
def test_password_valid():
    data = {"email": "valid@example.com", "password": "Password1"}
    serializer = RegisterSerializer(data=data)
    assert serializer.is_valid()
