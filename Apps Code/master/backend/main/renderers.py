from rest_framework.renderers import JSONRenderer
from main.encoders import JSONEncoder


class JSONRendererCustom(JSONRenderer):
  encoder_class = JSONEncoder
 