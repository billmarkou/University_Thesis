from djongo import models
from django import forms
from backend_app.fields import ObjectIdArrayField, ProductAmountField
from django.contrib.auth.models import User  

class ProductType(models.Model):
    _id = models.ObjectIdField()

    name = models.CharField(max_length=30)
    description = models.TextField()

    objects = models.DjongoManager()

    def natural_key(self):
        return {
            "_id": self._id,
            "name": self.name
        }

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Product Types"
        db_table = "productType"


class ProductCategory(models.Model):
    _id = models.ObjectIdField()

    name = models.CharField(max_length=30)
    description = models.TextField()

    type = models.ForeignKey(
        ProductType, null=True, on_delete=models.SET_NULL, db_column='type', verbose_name="Type")

    objects = models.DjongoManager()

    def natural_key(self):
        return {
            "_id": self._id,
            "name": self.name
        }

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Product Categories"
        db_table = "productCategory"


class Supplier(models.Model):

    _id = models.ObjectIdField()
    name = models.CharField(max_length=30)
    address = models.CharField(max_length=500)
    email = models.CharField(max_length=500)

    phone = models.CharField(max_length=16)

    def __str__(self):
        return self.name


class Product(models.Model):
    _id = models.ObjectIdField()

    name = models.CharField(max_length=30)
    code = models.CharField(max_length=10)
    image = models.ImageField(upload_to='images', null=True, blank=True,)
    description = models.TextField(null=True, blank=True)
    position = models.CharField(max_length=15)
    category = models.ForeignKey(
        ProductCategory, null=True, on_delete=models.SET_NULL, db_column='category', verbose_name="Category")
 
    quantity = models.IntegerField()

    price = models.FloatField()
    supply_price = models.FloatField()

    vat = models.FloatField(default=24)
    weight = models.FloatField(verbose_name="Weight(kg)")
    
    sizeX = models.FloatField(verbose_name="SizeX(cm)")
    sizeY = models.FloatField(verbose_name="SizeY(cm)")
    sizeZ = models.FloatField(verbose_name="SizeZ(cm)")

    objects = models.DjongoManager()

    def natural_key(self):
        return {
            "_id": self._id,
            "name": self.name,
            "code": self.code,
            "image": self.image,
            "description": self.description,
            "position": self.position,
            "category": self.category, 
            "quantity": self.quantity,
        }

    def __str__(self):
        return self.name

    class Meta:
        db_table = "product"


class OrderProduct(models.Model):
    product = models.ForeignKey(
        Product, null=True, on_delete=models.SET_NULL, db_column="productId")
    quantity = models.IntegerField()
    supplier = models.ForeignKey(
        Supplier, null=True, on_delete=models.SET_NULL, db_column='supplier', verbose_name="Supplier")


    def natural_key(self):
        return {
            "product": self.product,
            "supplier": self.supplier,
            "quantity": self.quantity
        }


class OrderProductForm(forms.ModelForm):
    class Meta:
        model = OrderProduct
        fields = (
            'product',
            'supplier',
            'quantity',
        )


class Order(models.Model):
    _id = models.ObjectIdField()
 
    ORDER_STATE = [
        ("open", "Open"), 
        ("to_approve", "Waiting approval"), 
        ("closed", "Closed")
    ]

    code = models.CharField(max_length=10)
    assigned_to = models.ForeignKey(
            User, null=True, on_delete=models.SET_NULL, related_name="assigned_to")

    products = models.ArrayField(
        model_container=OrderProduct,
        model_form_class=OrderProductForm,
        blank=True,
        null=True,
        default=[],
    )
    state = models.CharField(max_length=30, choices=ORDER_STATE)
    
    created_at = models.DateTimeField(db_column="createdAt", auto_now_add=True)
   
    created_by = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL )

    objects = models.DjongoManager()

    def __str__(self):
        return self.code

    class Meta:
        verbose_name= "Supply Order"
        verbose_name_plural= "Supply Orders"
        db_table = "order"


class FeaturedProduct(models.Model):
    _id = models.ObjectIdField()
    product_id = models.ForeignKey(
        Product, null=True, on_delete=models.SET_NULL, db_column="productId")

    def natural_key(self):
        return {
            self.product_id,
        }
    objects = models.DjongoManager()


class Session(models.Model):
    _id = models.ObjectIdField()
    
    session_id = models.CharField(max_length=1024)
    payload = models.TextField()
    created_at = models.DateTimeField(db_column="dateOfStart")

    objects = models.DjongoManager()
    
    class Meta:
        db_table = "session"


class ShopOrder(models.Model):
    _id = models.ObjectIdField()
    
    name = models.CharField(max_length=1024)
    surname = models.CharField(max_length=1024)
    email = models.CharField(max_length=1024)
    phone = models.CharField(max_length=1024)
    city = models.CharField(max_length=1024)
    address = models.CharField(max_length=1024)
    pc = models.CharField(max_length=1024, verbose_name="TK")

    SHIPPING_OPTIONS = [
        ("antikatabolh", "Αντικαταβολή"),
        ("paralabh", "Παραλαβή από το κατάστημα"), 
    ]

    shipping_type = models.CharField(max_length=1024, choices=SHIPPING_OPTIONS)

    total_price = models.FloatField()
    total_vat = models.FloatField()
    total_shipping = models.FloatField()

    products = ProductAmountField()

    created_at = models.DateTimeField(db_column="createdAt")

    assigned_to = models.ForeignKey(
        User, null=True, on_delete=models.SET_NULL, db_column="executiveId")

    completed = models.BooleanField(default=False)

    objects = models.DjongoManager()
    
    def __str__(self):
        return self.name  + " "  + self.surname

    class Meta:
        db_table = "shopOrder"



class PostalCode(models.Model):
    _id = models.ObjectIdField()
    
    code = models.IntegerField()

    lat = models.FloatField()
    lng = models.FloatField()


    objects = models.DjongoManager()
    
    def __str__(self):
        return str(self.code)

    class Meta:
        db_table = "postalcode"

class VolumetricWeightRange(models.Model):
    _id = models.ObjectIdField()
    
    weight_from = models.FloatField()
    weight_to = models.FloatField()

    cost = models.FloatField()
       
    objects = models.DjongoManager()
    
    def __str__(self):
        return str(self.weight_from) + " - " + str(self.weight_to) + " --> " + str(self.cost)

    class Meta:
        db_table = "volumetricweightrange"

class DistanceRange(models.Model):
    _id = models.ObjectIdField()
    
    distance_from = models.FloatField()
    distance_to = models.FloatField()

    cost = models.FloatField()
       
    objects = models.DjongoManager()
    
    def __str__(self):
        return str(self.distance_from) + " - " + str(self.distance_to) + " --> " + str(self.cost)

    class Meta:
        db_table = "distancerange"



class Setting(models.Model):
    _id = models.ObjectIdField()
    
    low_supply_threshold = models.IntegerField(default=5)
    aproval_cost_threshold = models.FloatField(default=1000)
    shop_postal_code = models.ForeignKey(
        PostalCode, null=True, on_delete=models.SET_NULL, db_column="shop_postal_code")
       
    objects = models.DjongoManager()
    
    def __str__(self):
        return "General settings"

    class Meta:
        db_table = "settings"