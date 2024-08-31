from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
import random

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, first_name, last_name, password, **extra_fields)

class CustomUser(AbstractBaseUser):
    INDIVIDUAL = 'Individual'
    ENTERPRISE = 'Enterprise'
    GOVERNMENT = 'Government'

    USER_TYPE_CHOICES = [
        (INDIVIDUAL, 'Individual'),
        (ENTERPRISE, 'Enterprise'),
        (GOVERNMENT, 'Government'),
    ]

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default=INDIVIDUAL)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=255)
    country = models.CharField(max_length=50, blank=True, null=True)
    state = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    pincode = models.CharField(max_length=10)
    mobile_number = models.CharField(max_length=15)
    fax = models.CharField(max_length=15, blank=True, null=True)
    # isd_code = models.CharField(max_length=10)
    phone = models.CharField(max_length=15, blank=True, null=True)
    password = models.CharField(max_length=128)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class Incident(models.Model):
    HIGH = 'High'
    MEDIUM = 'Medium'
    LOW = 'Low'

    STATUS_OPEN = 'Open'
    STATUS_IN_PROGRESS = 'In progress'
    STATUS_CLOSED = 'Closed'

    PRIORITY_CHOICES = [
        (HIGH, 'High'),
        (MEDIUM, 'Medium'),
        (LOW, 'Low'),
    ]

    STATUS_CHOICES = [
        (STATUS_OPEN, 'Open'),
        (STATUS_IN_PROGRESS, 'In progress'),
        (STATUS_CLOSED, 'Closed'),
    ]
    INCIDENT_TYPE_CHOICES = [
        (CustomUser.INDIVIDUAL, 'Individual'),
        (CustomUser.ENTERPRISE, 'Enterprise'),
        (CustomUser.GOVERNMENT, 'Government'),
    ]

    incident_id = models.CharField(max_length=20, unique=True, editable=False)
    reporter = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='incidents')
    reporter_name = models.CharField(max_length=60, blank=True, null=True)
    # incident_type = models.CharField(max_length=20, choices=INCIDENT_TYPE_CHOICES) 
    incident_type = models.CharField(max_length=20, choices=INCIDENT_TYPE_CHOICES, default=CustomUser.INDIVIDUAL)
    
    details = models.TextField()
    reported_date = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=MEDIUM)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_OPEN)

    def save(self, *args, **kwargs):
        if not self.incident_id:
            while True:
                random_number = random.randint(10000, 99999)
                new_incident_id = f'RMG{random_number}2022'
                if not Incident.objects.filter(incident_id=new_incident_id).exists():
                    self.incident_id = new_incident_id
                    break
        if self.reporter:
            self.reporter_name = f"{self.reporter.first_name} {self.reporter.last_name}"
        super().save(*args, **kwargs)

class Pincode(models.Model):
    pincode = models.CharField(max_length=10, unique=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50)