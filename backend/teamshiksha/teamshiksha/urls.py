from django.contrib import admin
from django.urls import path
from api.views import (
    RegisterView, 
    LoginView, 
    ProfileView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='refresh'),

    # User
    path('api/auth/me/', ProfileView.as_view(), name='me'),
]
