import jieba
from pymongo import MongoClient
import datetime
import json
client = MongoClient('mongodb://swarm_user:2016twelection@ec2-52-33-51-105.us-west-2.compute.amazonaws.com:27017')
db = client['2016_tw_election']
collection = db['facebook_politicians_posts']

#with open('data.txt', 'w') as outfile:
#    json.dump(data, outfile) 

### I am not sure the structure of facebook data. If there is any queries can extract
### messages directly plz let me know!!!

def readdb(politician_key):
    for post in collection.find({'politician_key': 'tsaiingwen'}):

        if post['data']:
            print (post['data'])
            break
        else:
            pass


def allocateMessage(message,key):
    
    text = []
    
    for m in messages:

                doc = m
                words = jieba.cut_for_search(m)
            
                chcontent = []
                encontent = []
                # Used regular expression to split Chinese and English
                ch = re.compile('[\u4e00-\u9fa5]')
                en = re.compile('[^\u4e00-\u9fa5]')
                for word in words:
                    print (word)
                    if ch.match(word):
                        chcontent.append(str(word.encode("utf-8")))
                    else:
                        encontent.append(word.lower())
                Tokens = chcontent + encontent
                removewords = [" ","","~","～"]
                Tokens = filter(lambda x: x not in removewords and len(x)>2, Tokens)

    return Tokens



if __name__ == '__main__':
    readdb()
