from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    country = models.CharField(max_length=100, blank=True, null=True)
    founded_year = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.country}) - Founded in {self.founded_year}"

class CarModel(models.Model):
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)  # Many-to-One relationship
    dealer_id = models.IntegerField()
    name = models.CharField(max_length=100)
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        # Add more choices as required
    ]
    car_type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')
    year = models.DateField()
    color = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.car_type}) - {self.year.year}"
