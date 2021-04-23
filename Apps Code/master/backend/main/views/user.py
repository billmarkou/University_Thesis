from django.shortcuts import render
from rest_framework import viewsets , permissions, status 
from rest_framework.decorators import action
from rest_framework.response import Response 
from rest_framework.renderers import JSONRenderer
from main.models import *
from main.serializers import *
from main.encoders import JSONEncoder
from django.forms.models import model_to_dict
import json
from main.renderers import JSONRendererCustom 
from django.core.paginator import Paginator
from rest_meets_djongo import serializers
from django.core.serializers import serialize
from django.contrib.auth import logout 
import uuid
import datetime

class UserView(viewsets.ModelViewSet):        
  queryset = ''
  renderer_classes = [JSONRendererCustom] 

  @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
  def current(self, request): 
 
    user = request.user 
 
    obj = {
      "username": user.username,
      "name": user.first_name,
      "surname": user.last_name,
      "e_mail": user.email,
      "phone_number": user.phone_number ,
      "job_placement": user.job_placement
    }

    return Response(obj)

  @action(detail=False, methods=['get'])
  def authenticated(self, request): 

    auth = False
    if request.user.is_authenticated:
      auth = True

    return Response(auth)

  @action(detail=False, methods=['get'])
  def logout(self, request): 
    request.user.auth_token.delete()
     
    res =  Response("ok")

    res.delete_cookie('authToken')
    return res

  @action(detail=False, methods=['get'])
  def create_session(self, request):  
    session_id = str(uuid.uuid4())
     
    session = Session()

    session.session_id = session_id
    session.payload = "{}"
    session.created_at = datetime.datetime.now()

    session.save()
 
    return Response(session_id)
