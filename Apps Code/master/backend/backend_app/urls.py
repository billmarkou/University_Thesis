"""diplomatiki URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static 
from rest_framework import routers     
 
from main.views import product,  user , category, type, cart, checkout

router = routers.DefaultRouter()
router.register(r'user', user.UserView, 'user')
router.register(r'product', product.ProductView, 'product')  
router.register(r'category', category.ProductCategoryView, 'category')
router.register(r'type', type.ProductTypeView, 'type')
router.register(r'cart', cart.CartView, 'cart')
router.register(r'checkout', checkout.CheckoutView, 'checkout')

 
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("select2/", include("django_select2.urls")),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


from rest_framework.authtoken import views
urlpatterns += [
    path('api-token-auth/', views.obtain_auth_token)
]

admin.site.site_header = 'Storage Handler'
admin.site.index_title = 'Administration panel'