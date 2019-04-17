from django.shortcuts import redirect
from django.contrib.auth.models import User
import requests

OAUTH_URL = 'https://id.nctu.edu.tw'

class OAuth:
    def __init__(self, client_id, client_secret, redirect_url):
        self.grant_type = 'authorization_code'
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_url = redirect_url

    def authorize(self):
        request_code = OAUTH_URL + '/o/authorize/?client_id=' + self.client_id + '&scope=profile&response_type=code'
        return redirect(request_code)

    def get_token(self, request, code):
        token_url = OAUTH_URL + '/o/token/'
        data = {
			'grant_type': 'authorization_code',
			'code': code,
			'client_id': self.client_id,
			'client_secret': self.client_secret,
			'redirect_uri': self.redirect_url
		}

        result = requests.post(token_url, data=data)
        if result.status_code == 200: # success
            payload = result.json()
            request.session['nctu_token'] = payload.get('access_token')
            request.session['logged_in'] = True
            return True
        else:
            print('failed')
            print(result.status_code)
            return False
        return False

    @staticmethod
    def get_profile(request):
        if request.session.get('nctu_token', None):
            token = request.session['nctu_token']
            headers = {
                'Authorization': 'Bearer ' + token
            }
            request_profile_url = OAUTH_URL + '/api/profile'
            request_name_url = OAUTH_URL + '/api/name'
            nctu_profile = requests.get(request_profile_url, headers=headers).json()
            try:
                user = User.objects.get(username=nctu_profile.get('username'),
                    email=nctu_profile.get('email'))
            except User.DoesNotExist:
                user = User.objects.create_user(username=nctu_profile.get('username'), 
                    email=nctu_profile.get('email'))
                user.is_staff = False
                user.is_superuser = False
                user.save()
            return user
        return None