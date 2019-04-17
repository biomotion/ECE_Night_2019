from rest_framework import permissions
from main.models import Profile

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Write permissions are only allowed to the owner of the snippet.
        if request.user.is_superuser: # superuser is king
            return True
        return obj.user.id == request.user.id

class IsBelongToOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser: # superuser is king
            return True
        return obj.owner.user.id == request.user.id


class IsSuperUser(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

class IsPostAndAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return request.user
        return False
class IsPutAndAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'PUT':
            return request.user
        return False

class IsUser(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.user:
            if request.user.is_superuser:
                return True
            else:
                return obj == request.user
        else:
            return False