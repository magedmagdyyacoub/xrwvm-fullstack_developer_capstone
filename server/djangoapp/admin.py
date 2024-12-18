from django.contrib import admin
from .models import CarMake, CarModel

# CarModelInline class
class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1

# CarModelAdmin class
class CarModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'car_make', 'car_type', 'year', 'color']
    search_fields = ['name', 'car_make__name']

# CarMakeAdmin class with CarModelInline
class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]
    list_display = ['name', 'description', 'country', 'founded_year']
    search_fields = ['name', 'country']

# Register models here
try:
    admin.site.register(CarMake, CarMakeAdmin)
except admin.sites.AlreadyRegistered:
    pass

try:
    admin.site.register(CarModel, CarModelAdmin)
except admin.sites.AlreadyRegistered:
    pass
