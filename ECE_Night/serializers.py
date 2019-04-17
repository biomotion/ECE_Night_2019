from django.contrib.auth.models import User, Group
from rest_framework import serializers
from main.models import Profile, Skill, Session, Program


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'username', 'password', 'is_superuser')

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name', 'need', 'owner', 'detail', 'learn')


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ('id', 'scores', 'skill_point', 'created','owner')

class ProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True,read_only=True)
    sessions = SessionSerializer(many=True, read_only=True)
    email = serializers.CharField(read_only=True)
    # highest_game_score = serializers.Field()
    class Meta:
        model = Profile
        fields = ('id','username', 
            'email','scores','skills', 'sessions')

class ProgramSerializer(serializers.ModelSerializer):
    # highest_game_score = serializers.Field()
    class Meta:
        model = Program
        fields = ('id','name', 
            'description','start_date','end_date')
