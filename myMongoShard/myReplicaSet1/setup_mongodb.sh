#!/bin/bash

RET=1
while [[ RET -ne 0 ]]; do
    echo "=> Waiting for confirmation of MongoDB service startup"
    sleep 5
    mongo admin --eval "help" >/dev/null 2>&1
    mongo admin --eval 'db.createUser({user:"siteUserAdmin",pwd:"shardingexample",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})'
	mongo admin --eval 'db.createUser({user:"siteRootAdmin",pwd:"shardingexample",roles:[{role:"root",db:"admin"}]})'
	mongo test --eval 'db.createUser({user:"test_user",pwd:"shardingexample",roles:[{role:"readWrite",db:"test"}]})'
    RET=$?
done

mongod --smallfiles --keyFile /opt/keyfile/mongodb-keyfile --replSet "rs0"
# mongod --smallfiles --replSet "rs0"

cfg = { "_id" : "rs0", "version" : 1, "members" : [{ "_id" : 0, "host" : "52.24.228.20:27017"}]}

# build image and run container; then go into mongo shell
# > rs.initiate() # hit enter
# rs0:OTHER> # hit enter again
# rs0:PRIMARY> use admin
# rs0:PRIMARY> db.createUser({user:"siteUserAdmin",pwd:"shardingexample",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})
# rs0:PRIMARY> db.auth('siteUserAdmin', 'shardingexample')
# rs0:PRIMARY> db.createUser({user:"siteRootAdmin",pwd:"shardingexample",roles:[{role:"root",db:"admin"}]})
# rs0:PRIMARY> db.auth('siteRootAdmin', 'shardingexample')
# rs0:PRIMARY> use test
# rs0:PRIMARY> db.createUser({user:"test_user",pwd:"shardingexample",roles:[{role:"readWrite",db:"test"}]})
# rs0:PRIMARY> db.auth('test_user', 'shardingexample')
# rs0:PRIMARY> use admin
# rs0:PRIMARY> db.auth('siteRootAdmin', 'shardingexample')
# rs0:PRIMARY> rs.status()
# rs0:PRIMARY> rs.conf()
# rs0:PRIMARY> rs.add('IP_PORT')
# rs0:PRIMARY> rs.add('IP_PORT')

# ==============================
# reconfig host of primary set
# cfg = rs.conf()
# cfg.members[0].host = "IP:27017"
# rs.reconfig(cfg)