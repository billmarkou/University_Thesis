from django.shortcuts import render
from rest_framework import viewsets , permissions, status 
from rest_framework.decorators import action
from rest_framework.response import Response 
from rest_framework.renderers import JSONRenderer
from main.models import Order, OrderProduct, Product
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

class OrderView(viewsets.ModelViewSet): 
  queryset = ''
  renderer_classes = [JSONRendererCustom]
  
  @action(detail=False, methods=['get'])
  def get(self, request):

    requested_page = request.GET.get('page', "1")
    requested_page = int(requested_page)

    orders = Order.objects.exclude(state = "closed")
  
    for order in orders:
      order.products

    p = Paginator(orders, 16)
    page = p.page(requested_page)

 
    result = {
      "items": page.object_list,
      "currentPage": requested_page,
      "pages": p.num_pages,
      "hasNext": page.has_next(),
      "hasPrevious": page.has_previous()
    }

    return Response(result)
  
  @action (detail=False, methods=['get'])
  def get_one(self, request):
    order_id = request.GET.get('id', None) 
    order = None
   
    # Attemt to transform string id to objectId
    try:
      order_id = ObjectId(order_id)
    except:
      raise ParseError("Order id was not provided")

    # Attemt to fetch a order from
    # the database using the object id
    try:
      order = Order.objects.get(_id=order_id)
    except:
      raise NotFound("Order was not found")

    # Return the product
    return Response(order)

  @action (detail=False, methods=['get'])
  def is_unique_code(self, request):
    code = request.GET.get('code', None)  
    
    exists = Order.objects.filter(code=code).exists()

    # Return the product
    return Response(exists)

  @action (detail=False, methods=['post'])
  def new(self, request):
    code = request.POST.get('code', None)  
    order_type = request.POST.get('orderType', None)  

    products = request.POST.get('products', None)  
    products = json.loads(products)

    start_date = request.POST.get('startDate', None)  
    end_date = request.POST.get('endDate', None)  

    publisher_id = request.user.id 

    orderQuery = Order()

    orderQuery.code = code
    orderQuery.order_type = order_type
    orderQuery.date_of_start = datetime.strptime( start_date, '%d/%m/%Y') if start_date else None
    orderQuery.date_of_end = datetime.strptime( end_date, '%d/%m/%Y' ) if end_date else None
    orderQuery.publisher_id = publisher_id
 

    product_list = []
    for product_and_amount in products:
      product = product_and_amount['product']
      amount = int(product_and_amount['amount'])

      order_product = OrderProduct()
      order_product.product_id = Product.objects.get(_id = ObjectId(product["_id"]) )
      order_product.quantity = amount 

      product_list.append(order_product)
      
    orderQuery.products = product_list
    orderQuery.state = "open"

    orderQuery.save()
    # Return the product
    return Response('ok')


  @action (detail=False, methods=['put'])
  def handle_order(self, request):
    order_id = request.POST.get('orderId', None)
    state = request.POST.get('state', None)
    
    if not order_id:
      raise ParseError("orderId is required but was not provided.")

    if not state:
      raise ParseError("state is required but was not provided.")
    
    order = Order.objects.get(_id=ObjectId(order_id))

    order.state = "in_progres" if state == "in_progres" else "closed"
    order.executive_id = request.user

    if order.state == "closed":
      nowDate = datetime.now()
      order.date_of_end = nowDate
    
 
    order.save()

    # Return the product
    return Response("ok")

  
  @action(detail=False, methods=['get'])
  def search(self, request):
    query = request.GET.get('query', None) 

    requested_page = request.GET.get('page', "1")
    requested_page = int(requested_page)
   
    if not query:
      raise ParseError("A query is needed to execute this action")
  
  
    try:
      orders = Order.objects.filter(Q(code__icontains=query))

      p = Paginator(orders, 8)
      page = p.page(requested_page)
      
      orders = {
        "items": page.object_list,
        "currentPage": requested_page,
        "pages": p.num_pages,
        "hasNext": page.has_next(),
        "hasPrevious": page.has_previous()
      }

    except:
      raise NotFound("Order was not found")


    # Return the product
    return Response(orders)