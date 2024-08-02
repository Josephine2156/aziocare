import os

class Config:
    SECRET_KEY = os.environ.get('Neko') or 'Neko'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/aziocare'
