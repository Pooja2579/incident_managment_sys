from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser, Incident
from .serializers import CustomUserSerializer, IncidentSerializer
from django.contrib.auth import authenticate
from .models import Pincode
from rest_framework.exceptions import PermissionDenied

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import UserLoginSerializer

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str  # For Django 3.0 and later
from django.contrib.auth.views import PasswordResetConfirmView as DjangoPasswordResetConfirmView
from django.urls import reverse_lazy

from django.template.loader import render_to_string
from django.views.generic import TemplateView
from django.contrib.auth.views import PasswordResetConfirmView


from django.shortcuts import render
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.exceptions import NotFound
from .models import CustomUser

from django.http import HttpResponse


class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

# class UserLoginView(generics.GenericAPIView):
#     serializer_class = UserLoginSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data["user"]
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({"token": token.key}, status=status.HTTP_200_OK)
class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)

class PincodeLookupView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        pincode = request.query_params.get('pincode')
        try:
            pincode_info = Pincode.objects.get(pincode=pincode)
            return Response({
                'city': pincode_info.city,
                'state': pincode_info.state,
                'country': pincode_info.country
            }, status=status.HTTP_200_OK)
        except Pincode.DoesNotExist:
            return Response({'error': 'Pincode not found'}, status=status.HTTP_404_NOT_FOUND)

class IncidentCreateView(generics.CreateAPIView):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        reporter = self.request.user
        serializer.save(reporter=reporter)

class IncidentListView(generics.ListAPIView):
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Incident.objects.filter(reporter=user)
    
class IncidentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = IncidentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            incident = Incident.objects.get(incident_id=pk, reporter=self.request.user)
            if incident.status == 'Closed' and self.request.method in ['PUT', 'PATCH']:
                raise PermissionDenied("Closed incidents cannot be edited.")
            return incident
        except Incident.DoesNotExist:
            raise PermissionDenied("Incident not found or you do not have permission to view it.")

class PasswordResetRequestView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = CustomUser.objects.filter(email=email).first()
        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            current_site = get_current_site(request)
            protocol = 'https' if request.is_secure() else 'http'
            # reset_link = f"{protocol}://{current_site.domain}/api/users/reset-password/{uid}/{token}/" 
            # reset_link = f"{protocol}://{current_site.domain}/api/users/reset-password/{uid}/{token}/"
            reset_link = f"{protocol}://{current_site.domain}/reset-password/{uid}/{token}/"

            send_mail(
                subject='Password Reset Request',
                message=f'Click the following link to reset your password: {reset_link}',
                from_email='no-reply@example.com',
                recipient_list=[email],
                fail_silently=False,
                html_message=render_to_string('registration/password_reset_email.html', {
                    'user': user,
                    'protocol': protocol,
                    'domain': current_site.domain,
                    'uid': uid,
                    'token': token,
                    'site_name': current_site.name,
                })
            )
        return Response({'message': 'If an account with that email exists, a password reset link has been sent.'})

    
class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'registration/password_reset_confirm.html'
    success_url = reverse_lazy('password_reset_complete')

class PasswordResetCompleteView(TemplateView):
    template_name = 'registration/password_reset_complete.html'



def test_email(request):
    send_mail(
        'Test Email',
        'This is a test email.',
        'no-reply@example.com',
        ['poojacse84@gmail.com'],
        fail_silently=False,
    )
    return HttpResponse('Test email sent!')



class ReporterDetailView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    lookup_field = 'email'  # Assumes lookup by email

    def get_object(self):
        email = self.kwargs.get('email')
        try:
            return CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise NotFound('Reporter not found')