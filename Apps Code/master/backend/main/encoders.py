import json
from bson import ObjectId
from django.core import serializers
from django.db.models import QuerySet
from django.forms.models import model_to_dict
from datetime import datetime
from djongo import models

from itertools import chain
from django.db.models.fields.files import ImageFieldFile

def to_dict(instance):
    opts = instance._meta
    data = {}
    for f in chain(opts.concrete_fields, opts.private_fields): 
        field = getattr(instance, f.name)
        if f.name != "password":
            if isinstance(field, models.Model):
                data[f.name] = to_dict( field ) 
            else:
                data[f.name] = field
            
    for f in  opts.many_to_many :
        data[f.name] = [i.id for i in f.value_from_object(instance)]
 
    return data

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
  
        if isinstance(o, models.Model): 
            return to_dict(o) 

        if isinstance(o, QuerySet): 
            res = []
            python_object = serializers.serialize('python', o, use_natural_foreign_keys=True, use_natural_primary_keys=False)
            
            for obj in python_object:
                fields = obj['fields'] 
                fields["_id"] = obj["pk"] 

                res.append(fields) 
            
            return res   
            
        if isinstance(o, ObjectId):
            return str(o)

        if isinstance(o, datetime):
            return str(o) 

        if isinstance(o, ImageFieldFile):
            try:
                return str(o)
            except :
                return ''
 
        return json.JSONEncoder.default(self, o)
 