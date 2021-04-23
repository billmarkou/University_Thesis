from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from main.models import ProductCategory, ProductType
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

class ProductCategoryView(viewsets.ModelViewSet): 
    
    queryset = ''
    renderer_classes = [JSONRendererCustom]

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.GET.get('query', None)

        if not query:
            raise ParseError("A query is needed to execute this action")

        try:
            categories = ProductCategory.objects.filter(
                Q(name__icontains=query))
        except:
            raise NotFound("Category was not found")

        # Return the product
        return Response(categories)

    @action(detail=False, methods=['get'])
    def get(self, request):
        type = request.GET.get('type', None) 
        
        try:
            if not type == None:
                typeEntry = ProductType.objects.get(_id=ObjectId(type))
                categories = ProductCategory.objects.filter(type=typeEntry)
            else:
                categories = ProductCategory.objects.all()
        except Exception as e:
            print('Error: '+ str(e)) 
            raise NotFound("Categories was not found")

        return Response(categories)
