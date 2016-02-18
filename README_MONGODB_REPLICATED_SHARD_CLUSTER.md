# MongoDB Replicated Shard Cluster

Three instances are created for the demo. For production, the mongos, the config. servers, and the replica sets are better hosted by different instances. One instance is hosting replica_set_0, another instance is hosting replica_set_1, and the other instance is hosting mongos and config servers

### Create Keyfile
cd myMongoShard/

openssl rand -base64 741 > mongodb-keyfile

### Configure Replica Set 0
##### Create Instance
switch to the directory of the replica set 0
> cd myMongoShard/myReplicaSet0

create the instance on EC2
> docker-machine create -d amazonec2 --swarm --swarm-discovery token://YOUR_TOKEN --amazonec2-access-key YOUR_ACCESS_KEY --amazonec2-secret-key YOUR_SECRET_KEY --amazonec2-vpc-id YOUR_VPC --amazonec2-security-group docker-swarm-mongodb-replica-set-0 --amazonec2-region us-west-2 swarm-shard-replica-set-0

check the swarm
> docker-machine ls

switch to swarm-shard-replica-set-0 environment
> docker-machine env swarm-shard-replica-set-0

> eval "$(docker-machine env swarm-shard-replica-set-0)"

build the image
> docker build -t mongo_replica_set_0 .

create the conatiners
> docker run --name replica_set_0_primary -p 27017:27017 -d mongo_replica_set_0

> docker run --name replica_set_0_seconadry_1 -p 27018:27017 -d mongo_replica_set_0

> docker run --name replica_set_0_seconadry_2 -p 27019:27017 -d mongo_replica_set_0

> docker run --name replica_set_0_arb -p 27020:27017 -d mongo_replica_set_0

check if the containers running properly
> docker ps

access the container of the primary set
> docker exec -it replica_set_0_primary bash

configure the replica set

> mongo --port 27017

> rs.initiate() # hit enter

> rs0:OTHER>

> rs0:PRIMARY> use admin

> rs0:PRIMARY> db.createUser({user:"siteUserAdmin",pwd:"pwd_shardingexample",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})

> rs0:PRIMARY> db.auth('siteUserAdmin', 'pwd_shardingexample')

> rs0:PRIMARY> db.createUser({user:"siteRootAdmin",pwd:"pwd_shardingexample",roles:[{role:"root",db:"admin"}]})

> rs0:PRIMARY> db.auth('siteRootAdmin', 'pwd_shardingexample')

> rs0:PRIMARY> use test

> rs0:PRIMARY> db.createUser({user:"test_user",pwd:"pwd_shardingexample",roles:[{role:"readWrite",db:"test"}]})

> rs0:PRIMARY> db.auth('test_user', 'pwd_shardingexample')

> rs0:PRIMARY> use admin

> rs0:PRIMARY> db.auth('siteRootAdmin', 'pwd_shardingexample')

> rs0:PRIMARY> rs.status()

> rs0:PRIMARY> rs.conf()

> rs0:PRIMARY> rs.add('REPLICA_SET_0_SECONDARY_1_IP:PORT')

> rs0:PRIMARY> rs.add('REPLICA_SET_0_SECONADRY_2_IP:PORT')

> rs0:PRIMARY> rs.addArb('REPLICA_SET_0_ARBITER_IP:PORT')

> rs0:PRIMARY> rs.status()

> rs0:PRIMARY> rs.conf()

> rs0:PRIMARY> cfg = rs.conf()

> rs0:PRIMARY> cfg.members[0].host = "REPLICA_SET_0_PRIMARY_IP:27017"

> rs0:PRIMARY> rs.reconfig(cfg)


### Configure Replica Set 1
##### Create Instance
cd myMongoShard/myReplicaSet1

create the instance

> docker-machine create -d amazonec2 --swarm --swarm-discovery token://YOUR_TOKEN --amazonec2-access-key YOUR_ACCESS_KEY --amazonec2-secret-key YOUR_SECRET_KEY --amazonec2-vpc-id YOUR_VPC --amazonec2-security-group docker-swarm-mongodb-replica-set-1 --amazonec2-region us-west-2 swarm-shard-replica-set-1

check the swarm

> docker-machine ls

switch to the swarm-shard-replica-set-1 environment

> docker-machine env swarm-shard-replica-set-1

> eval "$(docker-machine env swarm-shard-replica-set-1)"

build the image

> docker build -t mongo_replica_set_1 .

create the containers

> docker run --name replica_set_1_primary -d -p 27017:27017 -d mongo_replica_set_1

> docker run --name replica_set_1_seconadry_1 -d -p 27018:27017 -d mongo_replica_set_1

> docker run --name replica_set_1_seconadry_2 -d -p 27019:27017 -d mongo_replica_set_1

> docker run --name replica_set_1_arb -d -p 27020:27017 -d mongo_replica_set_1

check if the containers running properly

> docker ps

access the conatiner

> docker exec -it replica_set_1_primary bash

configure the replica set

> \> mongo

> rs.initiate() # hit enter

> rs1:OTHER> # hit enter again

> rs1:PRIMARY> use admin

> rs1:PRIMARY> db.createUser({user:"siteUserAdmin",pwd:"pwd_shardingexample",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})

> rs1:PRIMARY> db.auth('siteUserAdmin', 'pwd_shardingexample')

> rs1:PRIMARY> db.createUser({user:"siteRootAdmin",pwd:"pwd_shardingexample",roles:[{role:"root",db:"admin"}]})

> rs1:PRIMARY> db.auth('siteRootAdmin', 'pwd_shardingexample')

> rs1:PRIMARY> use test

> rs1:PRIMARY> db.createUser({user:"test_user",pwd:"pwd_shardingexample",roles:[{role:"readWrite",db:"test"}]})

> rs1:PRIMARY> db.auth('test_user', 'pwd_shardingexample')

> rs1:PRIMARY> use admin

> rs1:PRIMARY> db.auth('siteRootAdmin', 'pwd_shardingexample')

> rs1:PRIMARY> rs.status()

> rs1:PRIMARY> rs.conf()

> rs1:PRIMARY> cfg = rs.conf()

> rs1:PRIMARY> cfg.members[0].host = "REPLICA_SET_1_PRIMARY_IP:27017"

> rs1:PRIMARY> rs.reconfig(cfg)

> rs1:PRIMARY> rs.add('REPLICA_SET_1_SECONDARY_1_IP:PORT')

> rs1:PRIMARY> rs.add('REPLICA_SET_1_SECONADRY_2_IP:PORT')

> rs1:PRIMARY> rs.addArb('REPLICA_SET_1_ARBITER_IP:PORT')

> rs1:PRIMARY> rs.status()

> rs1:PRIMARY> rs.conf()


### Configure Config-Servers and Mongos (Router)
##### Create Instance

> cd myMongoShard/myConfigsvrMongos/

> docker-machine create -d amazonec2 --swarm --swarm-discovery token://YOUR_TOKEN --amazonec2-access-key YOUR_ACCESS_KEY --amazonec2-secret-key YOUR_SECRET_KEY --amazonec2-vpc-id YOUR_VPC --amazonec2-security-group docker-swarm-mongodb-replica-set-1 --amazonec2-region us-west-2 swarm-shard-configsvr-mongos

> cd myMongoShard/myConfigsvrMongos/myConfig

build the image

> docker build -t mongo_configsvr .

create the conatiners

> docker run --name mongo_configsvr_0 -p 27018:27019 -d mongo_configsvr

> docker run --name mongo_configsvr_1 -p 27019:27019 -d mongo_configsvr

> docker run --name mongo_configsvr_2 -p 27020:27019 -d mongo_configsvr

switch to the directory of myMongos

> cd myMongoShard/myConfigsvrMongos/myMongos

build the image

> docker build -t mongo_mongos .

create the container of mongos

> docker run --name mongos_1 -p 27017:27017 -d mongo_mongos

check if the containers running properly

> docker ps

access the conatiner

> docker exec -it mongos_1 bash

configure the mongos

> mongo

> mongos> use admin

> mongos> db.createUser({user:"siteUserAdmin",pwd:"pwd_shardingexample",roles:[{role:"userAdminAnyDatabase",db:"admin"}]})

> mongos> db.auth('siteUserAdmin', 'pwd_shardingexample')

> mongos> db.createUser({user:"siteRootAdmin",pwd:"pwd_shardingexample",roles:[{role:"root",db:"admin"}]})

> mongos> db.auth('siteRootAdmin', 'pwd_shardingexample')

> mongos> sh.addShard('rs0/YOUR_REPLICA_SET_0_PRIMARY_IP:YOUR_REPLICA_SET_0_PRIMARY_PORT,YOUR_REPLICA_SET_0_SECONDARY_1_IP:YOUR_REPLICA_SET_0_SECONDARY_1_PORT,YOUR_REPLICA_SET_0_SECONDARY_2_IP:YOUR_REPLICA_SET_0_SECONDARY_2_PORT,YOUR_REPLICA_SET_0_ARBITER_IP:YOUR_REPLICA_SET_0_ARBITER_PORT')

> mongos> sh.addShard('rs1/YOUR_REPLICA_SET_1_PRIMARY_IP:YOUR_REPLICA_SET_1_PRIMARY_PORT,YOUR_REPLICA_SET_1_SECONDARY_1_IP:YOUR_REPLICA_SET_1_SECONDARY_1_PORT,YOUR_REPLICA_SET_1_SECONDARY_2_IP:YOUR_REPLICA_SET_1_SECONDARY_2_PORT,YOUR_REPLICA_SET_1_ARBITER_IP:YOUR_REPLICA_SET_1_ARBITER_PORT')

> mongos> db.runCommand({enablesharding: 'test'}) # or sh.enableSharding('test')

> mongos> db.runCommand({shardcollection: 'test.test_collection', key: {_id: 1}})

> mongos> db.stats()

> mongos> db.printShardingStatus()

> mongos> use test

> mongos> db.stats()

> mongos> db.printShardingStatus()
