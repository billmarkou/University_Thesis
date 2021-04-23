from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from main.models import  OrderProduct, Product
from main.serializers import *
from main.encoders import JSONEncoder
from django.forms.models import model_to_dict
import json
from main.renderers import JSONRendererCustom
from django.core.paginator import Paginator
from rest_meets_djongo import serializers
from django.core.serializers import serialize

from bson import ObjectId
from rest_framework.exceptions import NotFound, ParseError
from django.db.models import Q

from datetime import datetime
from main.tools import get_session, set_session


class CartView(viewsets.ModelViewSet):
    queryset = ''
    renderer_classes = [JSONRendererCustom]

    @action(detail=False, methods=['get'])
    def get(self, request):
        cart = get_session(request, "cart")
        if not cart:
            cart = []

        product_count = {}

        products = []

        for product in cart:
            if product in product_count:
                product_count[product] += 1
            else:
                product_count[product] = 1

        for product_key in product_count:
            product = Product.objects.get(_id=ObjectId(product_key))
             
            products.append({
              "amount": product_count[product_key],
              "product": product
            })

        return Response(products)

    @action(detail=False, methods=['get'])
    def add(self, request):
        product_id = request.GET.get('product', None)

        cart = get_session(request, "cart")

        if not cart:
            cart = []
        
        cn = 0

        for product in cart:
            if product == product_id:
                cn += 1
        
        product = Product.objects.get(_id=ObjectId(product_id))
        if (cn >= product.quantity):
            return Response("overflow")

        cart.append(product_id)

        set_session(request, "cart", cart)

        return Response("ok")
    
    
    @action(detail=False, methods=['get'])
    def remove(self, request):
        product_id = request.GET.get('product', None)

        cart = get_session(request, "cart")

        if not cart:
            cart = []
        
        cart.remove(product_id)

        set_session(request, "cart", cart)

        return Response("ok")

    @action(detail=False, methods=['get'])
    def set_amount(self, request):
        product_id = request.GET.get('product', None)
        amount = int(request.GET.get('amount', None))

        cart = get_session(request, "cart")

        if not cart:
            cart = []

        cart = list(filter(lambda a: a != product_id, cart))  
        
        for x in range(amount):
            cart.append(product_id)


        set_session(request, "cart", cart)

        return Response("ok")

    @action(detail=False, methods=['get'])
    def remove_all(self, request):
        product_id = request.GET.get('product', None) 

        cart = get_session(request, "cart")

        if not cart:
            cart = []

        cart = list(filter(lambda a: a != product_id, cart))  
          
        set_session(request, "cart", cart)

        return Response("ok")    