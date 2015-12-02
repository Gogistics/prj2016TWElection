#!/bin/bash

# incomplete
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



