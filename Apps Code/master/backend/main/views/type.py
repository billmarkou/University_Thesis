from django.shortcuts import render
from rest_framework import viewsets , permissions, status 
from rest_framework.decorators import action
from rest_framework.response import Response 
from rest_framework.renderers import JSONRenderer
from main.models import ProductType
from main.serializers import *
from main.encoders import JSONEncoder
from django.forms.models import model_to_dict
import json
from main.renderers import JSONRendererCustom 
from rest_meets_djongo import serializers
from django.core.serializers import serialize
from rest_framework.exceptions import NotFound, ParseError
from bson import ObjectId
from django.db.models import Q 

class ProductTypeView(viewsets.ModelViewSet): 
  queryset = ''
  renderer_classes = [JSONRendererCustom]

  @action(detail=False, methods=['get'])
  def get(self, request):  
    try:
      types = ProductType.objects.all()
    except:
      raise NotFound("Product type was not found")
 
    return Response(types)
