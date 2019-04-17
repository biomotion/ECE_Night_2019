from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.main, name='main'),
    url('logout', views.Logout, name='logout'),
    url('oauth/google', views.google_oauth, name='oauth_google'),    
    url('oauth/nctu/login', views.nctu_login, name='oauth'),
    url('oauth/nctu', views.nctu_oauth, name='oauth_nctu'),
    url('night/ShootingNight', views.game, name='game'),
    url('program/edit', views.programme_edtor, name='program_editor'),
    url('program/delete/(?P<pk>\d+)$', views.programme_delete, name='program_delete'),
]