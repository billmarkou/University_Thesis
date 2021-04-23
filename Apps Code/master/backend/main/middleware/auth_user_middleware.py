# from main.models import Staff
from re import sub
from rest_framework.authtoken.models import Token
from main.models import Session
  
class AuthUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.  
        header_token = request.META.get('HTTP_AUTHORIZATION', None)
        if header_token is not None:
          try:
            token = sub('Token ', '', request.META.get('HTTP_AUTHORIZATION', None))
            token_obj = Token.objects.get(key = token)
            request.user = token_obj.user
          except Token.DoesNotExist:
            pass
 

        session_id =  request.headers.get('Session-Id')
        
        setattr(request, "current_session_id", session_id)
  
        response = self.get_response(request)
 
 
        return response