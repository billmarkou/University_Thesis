from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from main.models import ShopOrder, Product, VolumetricWeightRange, DistanceRange, PostalCode
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

import datetime
from main.tools import get_session, set_session, location_distance,get_settings
# from main.email_client import MailClient

class CheckoutView(viewsets.ModelViewSet):
    queryset = ''
    renderer_classes = [JSONRendererCustom]

    @action(detail=False, methods=['post'])
    def submit(self, request):
        name = request.POST.get('name', None)
        surname = request.POST.get('surname', None)
        email = request.POST.get('email', None)
        phone = request.POST.get('phone', None)
        city = request.POST.get('city', None)
        address = request.POST.get('address', None)
        pc = request.POST.get('pc', None)
        shipping = request.POST.get('shipping', None)
        totalVat = request.POST.get('totalVat', None)
        totalPrice = request.POST.get('totalPrice', None)
        totalShipping = request.POST.get('totalShipping', None)
        products = request.POST.get('products', None)

        set_session(request, "cart", [])

        order = ShopOrder()

        order.name = name
        order.surname = surname
        order.email = email
        order.phone = phone
        order.city = city
        order.address = address
        order.pc = pc

        order.shipping_type = shipping
        order.total_price = totalPrice
        order.total_shipping = totalShipping
        order.total_vat = totalVat

        order.created_at = datetime.datetime.now()

        order.products = products

        order.save()
        
        products = json.loads(products)

        for product_order in products:
            product = Product.objects.get(_id=ObjectId(product_order["_id"])) 
            product.quantity = product.quantity - int(product_order['amount'])
            product.save()


        return Response(order)

    @action(detail=False, methods=['get'])
    def get_volumetric_ranges(self, request):
        volumetric_ranges = VolumetricWeightRange.objects.all()

        return Response(volumetric_ranges)

    @action(detail=False, methods=['get'])
    def get_distance_ranges(self, request):
        distance_ranges = DistanceRange.objects.all()

        return Response(distance_ranges)

    @action(detail=False, methods=['get'])
    def get_distance(self, request):
        pc = request.GET.get('pc', None) 

        try:
            pc = PostalCode.objects.get(code=pc)
        except:
            return Response({ "error": "pc_not_found" })
            
        store_pc = get_settings().shop_postal_code

        distance = location_distance(pc.lat, pc.lng, store_pc.lat, store_pc.lng)

        return Response(distance)

 
    # @action(detail=False, methods=['get'])
    # def test(self, request):
    #     client = MailClient("TestStorageHandler@gmail.com", "1234qwer!@#$", "smtp.gmail.com", 587)
    #     client.send("this is a test", "hello test bro", "TestStorageHandler@gmail.com")
    #     return Response("ok")

 