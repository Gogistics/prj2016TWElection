import jieba
from pymongo import MongoClient
import datetime
import json
import re

client = MongoClient('mongodb://swarm_user:2016twelection@ec2-52-33-51-105.us-west-2.compute.amazonaws.com:27017')
db = client['2016_tw_election']
collection = db['facebook_politicians_posts']

#with open('data.txt', 'w') as outfile:
#    json.dump(data, outfile) 

### I am not sure the structure of facebook data. If there is any queries can extract
### messages directly plz let me know!!!

def readdb(politician_key):
    all_phrase = []
    for count, post in enumerate(collection.find({'politician_key': politician_key}),0):
        if post['data']:
            total = []
            for i in range(0,len(post['data'])):
                try:
                    doc = post['data'][i]['message']
                    phrase = cut_doc(doc)
                    total = total + phrase
                except:
                    pass
            all_phrase.extend(total)
        else:
            pass
    print(all_phrase)
    filename = 'phrase_'+politician_key+'.txt'
    with open (filename,'w') as f:
        for phrase in all_phrase:
            f.write('{}\n'.format(phrase))    

def cut_doc(doc):
    
    text = []
    url =re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', doc)
    for link in url:
        doc.remove(link)     
    words = jieba.cut_for_search(doc)

    chcontent = []
    encontent = []
    # Used regular expression to split Chinese and English
    ch = re.compile('[\u4e00-\u9fa5]')
    en = re.compile('[^\u4e00-\u9fa5]')

    for word in words:

        if ch.match(word):
            #chcontent.append(str(word.encode("utf-8")))
            chcontent.append(word)
        else:
            encontent.append(word.lower())
    Tokens = chcontent + encontent + url
    removewords = [" ","","~","～"]
    filted = [x for x in Tokens if x not in removewords]
    phrase = [x for x in filted if len(x)>1]
    print ([x for x in phrase])
    return phrase

#def creat_dict(Tokens):

#    with open('./dict.txt') as f:
#


if __name__ == '__main__':
    readdb('tsaiingwen')
