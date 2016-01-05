from pymongo import MongoClient
import datetime
client = MongoClient('mongodb://swarm_user:2016twelection@ec2-52-33-51-105.us-west-2.compute.amazonaws.com:27017')
db = client['2016_tw_election']
collection = db['facebook_politicians_posts']

for post in collection.find({'politician_key': 'tsaiingwen'}):
    print(post)