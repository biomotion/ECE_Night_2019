from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import ProfileSerializer, UserSerializer, SkillSerializer, SessionSerializer, ProgramSerializer
from django.contrib.auth.models import User
from main.models import Profile, Skill, Session, Program
from rest_framework import serializers
from .permission import IsOwner, IsUser, IsSuperUser, IsBelongToOwner, IsPostAndAuthenticated

class ProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def update(self, request, pk=None):
        profile = Profile.objects.get(pk=pk)

        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        elif self.action == 'update':
            self.permission_classes = [IsBelongToOwner]
        elif self.action == 'retrieve':
            self.permission_classes = [IsOwner]
        return super(self.__class__, self).get_permissions()

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        elif self.action == 'update':
            self.permission_classes = [IsBelongToOwner]
        elif self.action == 'retrieve':
            self.permission_classes = [IsUser]
        return super(self.__class__, self).get_permissions()

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    def create(self, request):
        serializer = SkillSerializer(data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        skill = Skill.objects.get(pk=pk)
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, pk=None):
        skill = Skill.objects.get(pk=pk)
        serializer = SkillSerializer(skill, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def partial_update(self, request, pk=None):
    #     pass

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        elif self.action == 'retrieve' or self.action == 'destroy' or self.action == 'update':
            self.permission_classes = [IsBelongToOwner]
        elif self.action == 'create':
            self.permission_classes = [IsPostAndAuthenticated, ]
        return super(self.__class__, self).get_permissions()

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def create(self, request):
        serializer = SessionSerializer(data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        session = Session.objects.get(pk=pk)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, pk=None):
        skill = Session.objects.get(pk=pk)
        serializer = SessionSerializer(skill, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # def partial_update(self, request, pk=None):
    #     pass

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [IsSuperUser, ]
        elif self.action == 'retrieve' or self.action == 'destroy' or self.action == 'update':
            self.permission_classes = [IsBelongToOwner]
        elif self.action == 'create':
            self.permission_classes = [IsPostAndAuthenticated, ]
        return super(self.__class__, self).get_permissions()


@api_view(['GET', 'POST', 'DELETE'])
def profile_skill_list(request, pk):
    """
    Retrieve, update or delete a code snippet.
    """
    queryset = Skill.objects.filter(owner=pk)
    try:
        skills = Skill.objects.filter(owner=pk)
    except Skill.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SkillSerializer(skills)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes((IsBelongToOwner,))
def profile_skill_details(request, pk, fk):
    """
    Retrieve, update or delete a code snippet.
    """
    queryset = Skill.objects.get(id=fk)
    try:
        skill = Skill.objects.get(id=fk)
    except Skill.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SkillSerializer(skill)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SkillSerializer(skill, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProgramViewSet(viewsets.ModelViewSet):
    """
    API endpoint allow only get detail and get all
    """
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer