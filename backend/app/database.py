from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.mongodb.DETAILS)
db = client.get_database("engineering_drawings")
