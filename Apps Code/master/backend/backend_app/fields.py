from djongo import models

from django.forms import CheckboxSelectMultiple

from django_select2.forms import Select2MultipleWidget

from bson.objectid import ObjectId


import typing


from django.utils.module_loading import import_string


from django.db.models import (

    Manager, Model, Field, AutoField,

    ForeignKey, BigAutoField

)


class ObjectIdArrayField(models.Field):

    description = ""

    def __init__(self,

                 model_container=None,  # : typing.Type[Model],
                 read_only=False,
                 *args, **kwargs):

        super().__init__(*args, **kwargs)

        self.model_container = model_container
        self.read_only = read_only
    # def get_db_prep_value(self, value, *args, **kwargs):

    #   return ["a", "v"]

    def to_python(self, value):
        if (type(self.model_container) is type(Model)): 
            m = self.model_container 
        else: 
            m = import_string(self.model_container)

        #print(type(value) is list)
        print(self.read_only)
        res = value 
        if type(value) is list:

            res = []

            for strId in value:
                if (self.read_only):
                    res.append(str(m.objects.get(_id=ObjectId(strId))))
                else: 
                    res.append(ObjectId(strId))

        return res

    def from_db_value(self, value, expression, connection, context):

        return self.to_python(value)

    def formfield(self, **kwargs):

        from django.forms import MultipleChoiceField

        if (type(self.model_container) is type(Model)):

            m = self.model_container

        else:

            m = import_string(self.model_container)

        objects = m.objects.all()

        choices = []

        for obj in objects:

            choices.append(

                (obj._id,  str(obj))

            )

        defaults = {'form_class': MultipleChoiceField,
                    'widget': Select2MultipleWidget, 'choices': choices}

        defaults.update(kwargs)

        return super(ObjectIdArrayField, self).formfield(**defaults)

        def deconstruct(self):

            # Use ImageField as path, as the deconstruct() will return ImageWithThumbnailsField

            name, path, args, kwargs = super(
                ObjectIdArrayField, self).deconstruct()

            return name, path, args, kwargs




class ProductAmountField(models.Field):

  
    def to_python(self, value):
        try:
            from main.models import Product
            import json

            items = json.loads(value)
            
            # print(items)
            result = ""

            for item in items:
                product = Product.objects.get(_id=ObjectId(item["_id"]))
                result += "(" + str(item["amount"]) +  "x) " + product.name + ","
        
            return result
        except: 
            return value
            
    def from_db_value(self, value, expression, connection, context):

        return self.to_python(value)
 
 

 