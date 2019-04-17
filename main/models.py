from django.db import models
from django.db.models import Max
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import datetime
# Create your models here.

class Session(models.Model):
	owner = models.ForeignKey('Profile', related_name='sessions', on_delete=models.CASCADE)
	scores = models.IntegerField(default=0)
	skill_point = models.IntegerField(default=0)
	created = models.DateTimeField(auto_now_add=True)

class Skill(models.Model):
	owner = models.ForeignKey('Profile', related_name='skills', on_delete=models.CASCADE)
	name = models.CharField(max_length=100)
	detail = models.CharField(max_length=200)
	learn = models.BooleanField(default=False)
	need = models.IntegerField(default=0)

class Profile(models.Model):
	user = models.OneToOneField(User, unique=True, null=False, db_index=True)
	username = models.CharField(max_length=100)
	email = models.CharField(max_length=200)
	studentID = models.CharField(max_length=50)
	scores = models.IntegerField(default=0)

	'''
		Retrieve or create a google linked profile
	'''
	@staticmethod
	def get_profile(user):
		try:
			profile = Profile.objects.get(user=user)
		except Profile.DoesNotExist:
			profile = Profile.objects.create(user=user, username=user.username,
				email=user.email)
			profile.save()
		return profile
	
	@property
	def highest_game_score(self):
		max_scores = self.sessions.all().aggregate(Max('scores'))
		if 'scores__max' in max_scores:
			score_list = self.sessions.filter(scores=max_scores['scores__max'])
			return score_list.first()
		return None

	# highest_game_score = property(calculate_game_score)

	@receiver(post_save, sender=User)
	def create_user_profile(sender, instance, created, **kwargs):
		if created:
			Profile.objects.create(user=instance, username=instance.username, email=instance.email)

	@receiver(post_save, sender=User)
	def save_user_profile(sender, instance, **kwargs):
		instance.profile.save()

class Program(models.Model):
	name = models.CharField(max_length=1000)
	start_date = models.TimeField()
	end_date = models.TimeField()
	description = models.CharField(max_length=500, default='')
