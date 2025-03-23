from django.urls import path

from . import views

urlpatterns = [
    path("search", views.search, name="search"),
    path("login", views.login, name="login"),
    path("settings", views.settings, name="settings"),
    path("settings/unit", views.insulin_correction, name="settings"),
    path("settings/units", views.units, name="settings"),
    path("settings/allUnits", views.all_units, name="settings"),
    path("settings/insulin", views.insulin, name="settings"),
    path("settings/range", views.range, name="settings"),
    path("settings", views.insulin, name="settings"),
    path("libreAPI", views.libre, name="libre"),
    path("libre/connection", views.libreConnection, name="libreConnection"),
    path("ownProduct", views.own_product, name="ownProduct"),
    path('train', views.train_model, name='train_model'),
    path('predict', views.predict_dose, name='predict_dose'),
]
