from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.shortcuts import render, redirect, HttpResponse, HttpResponseRedirect
from django.http import Http404
from django.conf import settings
from django.db import IntegrityError
from django.template import loader
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.db import transaction
from rest_framework.authtoken.models import Token
from .oauth import OAuth
from .models import Profile, Program

from datetime import datetime
# Create your views here.

oauthWrapper = OAuth(settings.NCTU_APP_CLIENT_ID, settings.NCTU_APP_CLIENT_SECRET, settings.NCTU_APP_REDIRECT_URI)

def main(request):
	if request.session.get('logged_in'):
		profile = oauthWrapper.get_profile(request)
		context = {
			'studentID': profile.get('username'),
			'email': profile.get('email')
		}
		return render(request, 'main/game.html', context)
	return render(request, 'main/game.html')

'''
	NCTU OAuth login portal
'''
def nctu_login(request):
	if OAuth.get_profile(request) == None:
		return oauthWrapper.authorize()
	return redirect('main')

'''
	NCTU Oauth redirect view
'''
# @transaction.atomic
# @login_required(login_url='/oauth/nctu/login')
def nctu_oauth(request):
	access_token = request.GET.get('code', None)
	httpResponse = redirect('/night/ShootingNight')
	if access_token and oauthWrapper.get_token(request, access_token):
		user = oauthWrapper.get_profile(request)
		profile = Profile.get_profile(user)
		request.session.set_expiry(settings.LOGIN_SESSION_TTL) #sets the exp. value of the session 
		login(request, user, backend='django.contrib.auth.backends.ModelBackend') #the user is now logged in
		try:
			token = Token.objects.create(user=user)
		except IntegrityError:
			token = Token.objects.get(user=request.user)

		httpResponse.set_cookie('nctu-ece-token', token.key)
		httpResponse.set_cookie('nctu-ece-id', user.id)
		httpResponse.set_cookie('nctu-ece-profile-id', profile.id)

		# return JsonResponse( { 'token':token.key, 'id': user.id, 'profile_id': profile.id } ) # maybe redirect to game and it read the token
		return httpResponse

	if request.user.is_authenticated():
		token = Token.objects.get(user=request.user)
		httpResponse.set_cookie('nctu-ece-token', token.key)
		httpResponse.set_cookie('nctu-ece-id', user.id)
		httpResponse.set_cookie('nctu-ece-profile-id', profile.id)
		return httpResponse
	return redirect('main') # other place

def google_oauth(request):
	user = request.user
	profile = Profile.get_profile(user)
	request.session.set_expiry(settings.LOGIN_SESSION_TTL) #sets the exp. value of the session 
	login(request, user, backend='django.contrib.auth.backends.ModelBackend') #the user is now logged in
	try:
		token = Token.objects.create(user=user)
	except IntegrityError:
		token = Token.objects.get(user=request.user)
	httpResponse = redirect('/night/ShootingNight')
	httpResponse.set_cookie('nctu-ece-token', token.key)
	httpResponse.set_cookie('nctu-ece-id', user.id)
	httpResponse.set_cookie('nctu-ece-profile-id', profile.id)
	# return JsonResponse( { 'token':token.key, 'id': user.id, 'profile_id': profile.id } ) # maybe redirect to game and it read the token
	return httpResponse

def leaderboard(request):
	profiles = [x for x in Profile.objects.all() if x.highest_game_score is not None]
	profiles = sorted(profiles, key=lambda x: x.highest_game_score.scores)
	leaderboard = []
	leaderboard_size = 50
	if len(profiles) == 0:
		return JsonResponse(leaderboard, safe=False)
	if len(profiles) < leaderboard_size:
		leaderboard_size = len(profiles);
	for profile in profiles[:leaderboard_size]:
		if profile:
			high_score = profile.highest_game_score
			leaderboard.append({
				'username': str(profile.username),
				'scores': int(high_score.scores),
				'date': str(high_score.created)
			})
	return JsonResponse({ 'leaderboard': leaderboard}, safe=False)

def programme_edtor(request, template_name='main/editor.html'):
	if request.user is None or request.user.username != settings.EDITOR_USERNAME:
		return Http404("Poll does not exist")
	programs = Program.objects.all()
	if request.POST:
		start_date_str = request.POST['startTime'].split(':')
		start_date = datetime.now()
		start_date.replace(hour=int(start_date_str[0]), minute=int(start_date_str[1]), month=5, day=27)
		end_date_str = request.POST['endTime'].split(':')
		end_date = datetime.now()
		end_date.replace(hour=int(end_date_str[0]), minute=int(end_date_str[1]), month=5, day=27)
		description = request.POST['description']
		name = request.POST['name']
		new_program = Program.objects.create(name=name, start_date=start_date, end_date=end_date, description=description)
		new_program.save()
		return redirect('program_editor')
	return render(request, template_name, {'programs':programs})

def programme_delete(request, pk):
	program = Program.objects.get(id=pk)
	if program:
		program.delete()
	return redirect('program_editor')

def game(request):
	return render(request, 'main/game.html')

def Logout(request):
	logout(request)
	return HttpResponseRedirect('/')