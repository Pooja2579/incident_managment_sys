from django.urls import path
from .views import (
    UserRegisterView, UserLoginView, PincodeLookupView,
    IncidentCreateView, PasswordResetCompleteView,
    CustomPasswordResetConfirmView, PasswordResetRequestView,
    IncidentListView, IncidentDetailView, ReporterDetailView, test_email 
)

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('pincode/', PincodeLookupView.as_view(), name='pincode-lookup'),
    path('incidents/create/', IncidentCreateView.as_view(), name='create_incident'),
    path('incidents/list/', IncidentListView.as_view(), name='list_incidents'),
    path('incidents/<str:pk>/', IncidentDetailView.as_view(), name='incident_detail'),
    path('incidents/edit/<str:pk>/', IncidentDetailView.as_view(), name='incident_edit'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('reset-password/<uidb64>/<token>/', CustomPasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('reporter/<str:email>/', ReporterDetailView.as_view(), name='reporter_detail'),
     path('test-email/', test_email, name='test_email'),
]
