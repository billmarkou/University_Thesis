import random
import string
import json

from main.models import Session, Setting


def random_str(N):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(N))


def get_session(request, name):
    session_id = request.current_session_id
    session = None
    session_data = {}

    if session_id:
        if Session.objects.filter(session_id=session_id).exists():
            session = Session.objects.get(session_id=session_id)

            if session:
                session_data = json.loads(session.payload)

    if name in session_data:
        return session_data[name]
    else:
        return None


def set_session(request, name, value):
    session_id = request.current_session_id

    if session_id:
        if Session.objects.filter(session_id=session_id).exists():
            session = Session.objects.get(session_id=session_id)

            if session:
                session_data = json.loads(session.payload)
                session_data[name] = value

                session_json = json.dumps(session_data)
                session.payload = session_json
                session.save()


def get_settings():

    try:
        site_settings = Setting.objects.all()
        site_settings = site_settings[0]
        return site_settings
    except:
        return None


# Units ( M = miles, K = kilometers, N = nautical miles )
def location_distance(lat1, lon1, lat2, lon2, unit="K"):
    import math
  
    if lat1 == lat2 and lon1 == lon2:
        return 0
    else:
        radlat1 = (math.pi * lat1) / 180
        radlat2 = (math.pi * lat2) / 180
        theta = lon1 - lon2
        radtheta = (math.pi * theta) / 180
        dist = math.sin(radlat1) * math.sin(radlat2) + math.cos(radlat1) * math.cos(radlat2) * math.cos(radtheta)
        if dist > 1:
            dist = 1
        
        dist = math.acos(dist)
        dist = (dist * 180) / math.pi
        dist = dist * 60 * 1.1515
        if unit == "K":
            dist = dist * 1.609344
        
        if unit == "N":
            dist = dist * 0.8684
        
        return dist
    