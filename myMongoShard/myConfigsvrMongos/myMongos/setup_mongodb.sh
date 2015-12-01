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
# mongos> # hit enter again
# mongos> use admin
# mongos> db.createUser({user:"siteUserAdmin",pwd:"shardingexample",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})
# mongos> db.auth('siteUserAdmin', 'shardingexample')
# mongos> db.createUser({user:"siteRootAdmin",pwd:"shardingexample",roles:[{role:"root",db:"admin"}]})
# mongos> db.auth('siteRootAdmin', 'shardingexample')

# mongos> sh.addShard('rs0/52.24.228.20:27017,52.24.228.20:27018,52.24.228.20:27019,52.24.228.20:27020')
# mongos> sh.addShard('rs1/52.34.228.30:27017,52.34.228.30:27018,52.34.228.30:27019,52.34.228.30:27020')

# mongos> db.runCommand({enablesharding: 'test'}) # or sh.enableSharding('test')
# mongos> db.runCommand({shardcollection: 'test.test_collection', key: {_id: 1}})

# mongos> db.stats()
# mongos> db.printShardingStatus()

# mongos> use test
# mongos> db.stats()
# mongos> db.printShardingStatus()
