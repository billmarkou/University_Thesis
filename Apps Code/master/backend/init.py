import os

#makemigrations only for:
#admin, auth, contenttypes, sessions
# ONLY MAKE MIGRATIONS FOR DEFAULT DJANGO ADMIN APPS!!
out = os.system("python3 manage.py makemigrations admin")
print(out)
 
out = os.system("python3 manage.py makemigrations auth")
print(out)

out = os.system("python3 manage.py makemigrations contenttypes")
print(out)

out = os.system("python3 manage.py makemigrations sessions")
print(out)
 
#MIGRATE TO GENERATE PERMITIONS
out = os.system("python3 manage.py migrate")
print(out)

#RUN THE APP
out = os.system("python3 manage.py runserver 0.0.0.0:8000 --noreload")
print(out)