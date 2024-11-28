# models.py in your app
from django.db import models
import uuid


from django.db import models

class Department(models.Model):
    id = models.AutoField(primary_key=True)  # Matches SERIAL PRIMARY KEY in Supabase
    name = models.CharField(max_length=255, unique=True)  # Matches the TEXT type
    head_of_department = models.ForeignKey(
        'Employee',  # References the Employee model
        on_delete=models.SET_NULL,  # Matches ON DELETE SET NULL in Supabase
        null=True,  # Allows NULL for foreign key
        blank=True,
        related_name='managed_departments'
    )
    created_at = models.DateTimeField(auto_now_add=True)  # Matches TIMESTAMPTZ DEFAULT NOW()
    updated_at = models.DateTimeField(auto_now=True)  # Matches TIMESTAMPTZ DEFAULT NOW()

    def __str__(self):
        return self.name

class Employee(models.Model):
    id = models.AutoField(primary_key=True)  # Matches SERIAL PRIMARY KEY in Supabase
    employees_id = models.CharField(max_length=100, unique=True)  # Employee's unique identifier
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='employees'
    )
    # Other fields...
