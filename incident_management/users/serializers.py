import re
from rest_framework import serializers
from .models import CustomUser, Incident
from django.contrib.auth import authenticate

class PasswordValidator:
    def __init__(self):
        self.min_length = 8
        self.requirements = {
            'uppercase': re.compile(r'[A-Z]'),
            'number': re.compile(r'\d'),
        }
    
    def __call__(self, password):
        if len(password) < self.min_length:
            raise serializers.ValidationError(f"Password must be at least {self.min_length} characters long.")
        if not self.requirements['uppercase'].search(password):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not self.requirements['number'].search(password):
            raise serializers.ValidationError("Password must contain at least one number.")
        return password

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[PasswordValidator()])  # Apply custom validation

    class Meta:
        model = CustomUser
        fields = ['id', 'user_type', 'first_name', 'last_name', 'email', 'address', 'country', 'state', 'city', 'pincode', 'mobile_number', 'fax', 'phone', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(**validated_data, password=password)
        return user

class IncidentSerializer(serializers.ModelSerializer):
    reporter_name = serializers.SerializerMethodField()

    class Meta:
        model = Incident
        fields = ['incident_id', 'reporter_name', 'details', 'reported_date', 'priority', 'status', 'incident_type']

    def get_reporter_name(self, obj):
        if obj.reporter:
            return f"{obj.reporter.first_name} {obj.reporter.last_name}"
        return None

    def update(self, instance, validated_data):
        if instance.status == 'Closed':
            raise serializers.ValidationError("Cannot edit a closed incident.")
    
        if instance.reporter != self.context['request'].user:
            raise serializers.PermissionDenied("You do not have permission to edit this incident.")
    
        instance.details = validated_data.get('details', instance.details)
        instance.priority = validated_data.get('priority', instance.priority)
        instance.status = validated_data.get('status', instance.status)
        instance.incident_type = validated_data.get('incident_type', instance.incident_type)
        instance.save()
    
        return instance




class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if email and password:
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError("Invalid login credentials.")

            user = authenticate(username=email, password=password)
            if user is None:
                raise serializers.ValidationError("Invalid login credentials.")
        else:
            raise serializers.ValidationError("Must include both email and password.")

        data["user"] = user
        return data
