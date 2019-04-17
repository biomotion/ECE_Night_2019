"""ECE_Night URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from . import views
from main.views import leaderboard
router = routers.DefaultRouter()
router.register(r'profiles', views.ProfileViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'skills', views.SkillViewSet)
router.register(r'sessions', views.SessionViewSet)
router.register(r'programs', views.ProgramViewSet)

urlpatterns = [
    url(r'^adm1n/', admin.site.urls),
    url(r'^oauth/google/', include('social_django.urls', namespace='social')),
    # url(r'^oauth/google/', include('django.contrib.auth.urls', namespace='auth')),
    url(r'^', include('main.urls')),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^api/leaderboard', leaderboard, name='leaderboard'),
]
