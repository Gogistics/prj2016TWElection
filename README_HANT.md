# Project for 2016 TW Election

http://2016-tw-election.gogistics-tw.com/

### Development of Web Application of Tracking 2016 Taiwan Election
This project is for analyzing the trend of 2016 Taiwan Election. The applications will be developed with the follwoing frameworks, libs, and so on:

**AWS EC2** 雲端平台，用於佈署虛擬主機

**Virtualbox** 用於建立虛擬環境執行docker

**Docker Swarm** is for deploying container swarm to handle web services and databases

**MongoDB** 跨執行環境的NoSQL資料庫

**Nginx** 高性能的多用途伺服器，在此專案中用作proxy server

**Node.js** 基於Chrome V8引擎的JavaScript運行環境

**Express** 用於Node.js的應用框架

**Jade** Express的模板引擎

**Bootstrap** Twitter開發的前端開源套件，用於開發使用者介面

**D3** JavaScript的開源套件，用於視覺化資料

**Leaflet** JavaScript的開源套件，用於視覺化地理資訊

---

### Deployment of Virtual Machines on EC2 with Docker Swarm
#####Instances Deployment

*Set up swarm master-*

> docker-machine create -d amazonec2 --swarm --swarm-master --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-master

*Set up swarm containers for nodes and databases-*

> docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-node-1

> docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-node-2

> docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-db-1

> docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-db-1-1

#####MongoDB Configuration-

*Create dir and key-file*

> root@alantai:/# mkdir -p /my_app/data /my_app/keyfile

> root@alantai:/# cd /my_app/keyfile

> root@alantai:/# openssl rand -base64 741 > mongodb-keyfile

> root@alantai:/# chmod 600 mongodb-keyfile

> root@alantai:/# sudo chown 999 mongodb-keyfile
  
*Create MongoDB Container*
  
> root@alantai:/# docker run --name my_mongo -v /my_app/data:/data/db --hostname="{PRIMARY_DB_IP}" -p 27017:27017 -d mongo --smallfiles

*Configure Primary DB*
> root@alantai:/# docker exec -it mongo /bin/bash

> root@alantai:/# mongo

> \> use admin

> \> db.createUser( {
     user: "siteUserAdmin",
     pwd: "{YOUR_PASSWORD}",
     roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
   });

> \> db.createUser( {
     user: "siteRootAdmin",
     pwd: "{YOUR_PASSWORD}",
     roles: [ { role: "root", db: "admin" } ]
   });
   
> \> exit

> root@alantai:/# docker stop mongo

> root@alantai:/# docker rm mongo

> root@alantai:/# docker run --name mongo -v /my_app/data:/data/db -v /my_app/keyfile:/opt/keyfile --hostname="{PRIMARY_DB.com}"
--add-host primary_db.com:{PRIMARY_DB_IP} --add-host replica_db_1.com:{REPLICA_DB_1_IP} --add-host replica_db_1.com:{REPLICA_DB_1_IP} -p 27017:27017 -d mongo --smallfiles --keyFile /opt/keyfile --replSet "rs0"

> root@alantai:/# docker exec -it mongo /bin/bash

> root@alantai:/# mongo

> \> use admin

> \> db.auth("siteRootAdmin", "{YOUR_PASSWORD}");

> \> use {CUSTOM_DB}

> \> db.createUser( {
      user: "{CUSTOM_DB_USER}",
      pwd: "{CUSTOM_USER_PASSWORD}",
      roles: [ { role: "readWrite", db: "{CUSTOM_DB}" } ]
      } )
      
> \> rs.initiate()

> \>

> \> rs.conf()

*Start other secondary MongoDB instances*

> root@alantai:/# docker run --name mongo -v /my_app/data:/data/db -v /my_app/keyfile:/opt/keyfile --hostname="{SECONDARY_DB.com}" --add-host replica_db_1.com:{REPLICA_DB_1_IP} --add-host replica_db_1_1.com:{REPLICA_DB_1_1_IP} -p 27017:27017 -d mongo --smallfiles --keyFile /opt/keyfile --replSet "rs0"

*Once secondary MongoDB instances are configured successfully, go back to primary MongoDB instance to add secondary instances*

> \> rs.add("{REPLICA_DB_1_1_IP}")

#####Deploy App

*Clone project and run locally for testing*

> git clone git@github.com:Gogistics/prj2016TWElection.git

> cd prj2016TWElection/docker-nginx-node-2016-tw-election

Before running the command below, you need to set the environment variables to make email mechanism work and build connection between you app and MongoDB

> sh .local_start.sh

Open your browser and you're able to access your website at http://localhost:8080/

#####Build Containers

To deploy the docker containers to the instance, go to the dir which contains the docker-compose.yml file and execute the following command

> docker-compose up -d

###continue...
