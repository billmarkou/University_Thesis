from django.shortcuts import render
from rest_framework import viewsets , permissions, status 
from rest_framework.decorators import action
from rest_framework.response import Response 
from rest_framework.renderers import JSONRenderer
from main.models import Product, ProductCategory, FeaturedProduct
from main.serializers import *
from main.encoders import JSONEncoder
from django.forms.models import model_to_dict 
from main.renderers import JSONRendererCustom 
from django.core.paginator import Paginator
from rest_meets_djongo import serializers
from django.core.serializers import serialize

from bson import ObjectId
from rest_framework.exceptions import NotFound, ParseError

from django.db.models import Q

from django.core.files.storage import FileSystemStorage
from django.conf import settings
from main.tools import random_str 

class ProductView(viewsets.ModelViewSet): 
  queryset = ''
  renderer_classes = [JSONRendererCustom]

  @action(detail=False, methods=['get'])
  def get(self, request): 
    
    requested_page = request.GET.get('page', "1")
    requested_page = int(requested_page)
    category = request.GET.get('category', None) 

 
    if category:
      products = Product.objects.filter(category=ObjectId(category))
    else:
      products = Product.objects.all()


    p = Paginator(products, 8)
    page = p.page(requested_page)
    
    result = {
      "items": page.object_list,
      "currentPage": requested_page,
      "pages": p.num_pages,
      "hasNext": page.has_next(),
      "hasPrevious": page.has_previous()
    }

         
    return Response(result)
 
  @action(detail=False, methods=['get'])
  def get_one(self, request):
    product_id = request.GET.get('id', None) 
    product = None

    # Attemt to transform string id to objectId
    try:
      product_id = ObjectId(product_id)
    except:
      raise ParseError("Product id was not provided")

    # Attemt to fetch a product from
    # the database using the object id
    try:
      product = Product.objects.get(_id=product_id)
      
    except:
      raise NotFound("Product was not found")

    # Return the product
    return Response(product)



  @action(detail=False, methods=['get'])
  def search(self, request):
    query = request.GET.get('query', None) 
    category = request.GET.get('category', None) 

    requested_page = request.GET.get('page', "1")
    requested_page = int(requested_page)
   
    if not query:
      raise ParseError("A query is needed to execute this action")
  
  
    try:
      if category:
        products = Product.objects.filter(Q(name__icontains=query) | Q(code__icontains=query) & Q(category=ObjectId(category)))
      else:
        products = Product.objects.filter(Q(name__icontains=query) | Q(code__icontains=query))

      p = Paginator(products, 8)
      page = p.page(requested_page)
      
      products = {
        "items": page.object_list,
        "currentPage": requested_page,
        "pages": p.num_pages,
        "hasNext": page.has_next(),
        "hasPrevious": page.has_previous()
      }

    except:
      raise NotFound("Product was not found")


    # Return the product
    return Response(products)
    

  @action (detail=False, methods=['get'])
  def is_unique_code(self, request):
    code = request.GET.get('code', None)  
    
    exists = Product.objects.filter(code=code).exists()

    # Return the product
    return Response(exists)

  @action (detail=False, methods=['post'])
  def new(self, request) :
    code = request.POST.get('code', None) 
    quantity = int(request.POST.get('quantity', None))
    name =  request.POST.get('name', None) 
    description = request.POST.get('description', None) 
    position = request.POST.get('position', None) 
    image = request.FILES["image"]
    category_id = request.POST.get('categoryId', None)
    product_category = ProductCategory.objects.get(_id = category_id) 

    productQuery = Product()
 
    fs = FileSystemStorage(location=settings.MEDIA_ROOT + "images/")

    file_name = image.name + random_str(5)

    file = fs.save(file_name, image) 
    # the fileurl variable now contains the url to the file. This can be used to serve the file when needed. 
    fs.url(file) 

    productQuery.code = code
    productQuery.quantity = quantity
    productQuery.name = name
    productQuery.description = description
    productQuery.position = position
    productQuery.image = "images/" + file_name
    productQuery.category = product_category

    productQuery.save()
  
    return Response('ok')


  @action (detail=False, methods=['get'])
  def get_featured(self, request): 
    
    featured = FeaturedProduct.objects.all()


    # Return the product
    return Response(featured)