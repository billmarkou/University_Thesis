FROM python:3.8.7-slim
 

ENV PYTHONUNBUFFERED 1

RUN pip install pipenv

WORKDIR /backend

COPY ./Pipfile ./Pipfile
COPY ./Pipfile.lock ./Pipfile.lock 

RUN pipenv sync --system

COPY . .

EXPOSE 8000:8000

CMD [ "python3", "init.py" ]
