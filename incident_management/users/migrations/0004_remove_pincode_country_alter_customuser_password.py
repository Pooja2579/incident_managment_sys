# Generated by Django 4.2.6 on 2024-08-21 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_incident_incident_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pincode',
            name='country',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='password',
            field=models.CharField(max_length=128, verbose_name='password'),
        ),
    ]
