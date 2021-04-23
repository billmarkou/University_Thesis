from main.models import *
from django.contrib import admin

from main.models_admin import ReadOnlyModelAdmin
from django.contrib.admin import SimpleListFilter

from django.contrib import messages
from django.http import HttpResponseRedirect

import datetime
 
from django.conf import settings

from django.shortcuts import redirect

from main.tools import get_settings
from main.email_client import MailClient

from django.contrib import admin
from django.contrib.admin.models import LogEntry, DELETION
from django.utils.html import escape
from django.urls import reverse
from django.utils.safestring import mark_safe

from django.contrib.auth.models import Permission
admin.site.register(Permission)


admin.site.site_url = "http://storage-handler.mydissent.net/"

@admin.register(ShopOrder)
class ShopOrderAdmin(admin.ModelAdmin):
    list_filter = ('assigned_to', "completed")
    list_display = ('name', 'surname', 'created_at', 'assigned_to')
    readonly_fields = [
        "name",
        "surname",
        "email",
        "phone",
        "city",
        "address",
        "pc", 
        "shipping_type",
        "total_price",
        "total_vat",
        "total_shipping",
        "products",
        "created_at", 
        "completed", 
    ]

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_staff:
            if request.user.is_superuser:
                return self.readonly_fields  
            else:
                return  ["assigned_to"] + self.readonly_fields 

    def response_change(self, request, obj):
        if "_complete-order" in request.POST:


            obj.completed = True
            obj.save()

            client = MailClient(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD, settings.EMAIL_SERVER, settings.EMAIL_PORT)
            client.send("Your product is on the way", "Your order is complete", obj.email)

            messages.add_message(
                request, messages.SUCCESS, 'Order marked as complete')
 
        return super().response_change(request, obj)

    def change_view(self, request, object_id, form_url='', extra_context=None):
        obj = ShopOrder.objects.get(_id=object_id)
        extra_context = extra_context or {}
        extra_context["show_complete_button"] = False

        if (request.user == obj.assigned_to and obj.completed == False):
            extra_context["show_complete_button"] = True

        return super(ShopOrderAdmin, self).change_view(request, object_id, form_url, extra_context)
 
@admin.register(FeaturedProduct)
class FeaturedProductsAdmin(admin.ModelAdmin):
    pass

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    pass

class ProductLowSupply(SimpleListFilter):
    title = 'Supply' # or use _('country') for translated title
    parameter_name = 'low_supply'

    def lookups(self, request, model_admin):
         
        return [('low_supply', 'Low supply')]

    def queryset(self, request, queryset):
        site_settings = get_settings()

        threshold = site_settings.low_supply_threshold if site_settings else 5
        if self.value() == 'low_supply':
            return queryset.filter(quantity__lte=threshold)
        if self.value():
            return queryset.filter()

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'quantity', 'position')
    list_filter = ('category', ProductLowSupply)
    search_fields = ('name', 'code')



@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    pass

@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    pass
 
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_filter = ('state', 'assigned_to')
    list_display = ('code', 'created_at')
    readonly_fields = ['created_at', 'state', 'created_by']
    search_fields = ('code', )

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_staff:
            if request.user.is_superuser:
                return self.readonly_fields  
            else:
                return  ["assigned_to"] + self.readonly_fields 

    def save_model(self, request, obj, form, change):

        obj.created_by = request.user

        product_sum = 0
        for p in obj.products:
            product_sum = product_sum + (p.product.supply_price * p.quantity)
        
        site_settings = get_settings()

        threshold = site_settings.aproval_cost_threshold if site_settings else 1000

        if not obj.state == "open":
            if product_sum > threshold:
                obj.state = "to_approve"
            else: 
                obj.state = "open"

        obj.created_at = datetime.datetime.now()

        obj.save()

        super(OrderAdmin, self).save_model(request, obj, form, change)

    def response_change(self, request, obj):
        if "_approve-order" in request.POST:

            obj.state = "open"
            obj.save()

            messages.add_message(
                request, messages.SUCCESS, 'Order marked as open')
        elif "_close-order" in request.POST:

            for p in obj.products:
                p.product.quantity = p.product.quantity + p.quantity
                p.product.save()

            obj.state = "closed"
            obj.save()

            messages.add_message(
                request, messages.SUCCESS, 'Order marked as closed')
        return super().response_change(request, obj)

    def change_view(self, request, object_id, form_url='', extra_context=None):
        obj = Order.objects.get(_id=object_id)
        extra_context = extra_context or {}
        extra_context["show_complete_button"] = False

        if (obj.state == "to_approve") and request.user.is_superuser:
            extra_context["show_approve"] = True
        elif (obj.state == "open" and request.user == obj.assigned_to):
            extra_context["show_close"] = True

        return super(OrderAdmin, self).change_view(request, object_id, form_url, extra_context)


@admin.register(Setting)
class SettingsAdmin(admin.ModelAdmin):
    def changelist_view(self, request, extra_context=None):
        if (self.model.objects.all().count()>0):
            settings_id = self.model.objects.first()._id
            return redirect(settings.ADMIN_PREFIX + '/'+self.model._meta.app_label+'/'+self.model._meta.model_name+'/'+str(settings_id)+'/change/')
        else: 
            return redirect(settings.ADMIN_PREFIX + '/'+self.model._meta.app_label+'/'+self.model._meta.model_name+ '/add/')

    def has_add_permission(self, request):
        if self.model.objects.filter().exists():
            return False
        else: 
            return True

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(VolumetricWeightRange)
class VolumetricWeightRangeAdmin(admin.ModelAdmin):
    pass


@admin.register(DistanceRange)
class DistanceRangeAdmin(admin.ModelAdmin):
    pass


@admin.register(PostalCode)
class PostalCodeAdmin(admin.ModelAdmin):
    pass




