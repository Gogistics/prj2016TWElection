# Project for 2016 TW Election

### Deployment of Virtual Machines on EC2 with Docker Swarm
This project is for analyzing the trend of 2016 Taiwan Election. The applications will be developed with the follwoing frameworks, libs, and so on:

**AWS EC2** is for hosting the virtual machines

**Docker Swarm** is for deploying container swarm to handle web services and databases

**MongoDB** is a cross-platform document-oriented database

**Nginx** is working as the proxy server

**Node.js** is for developing the web app

**Express** is a Node.js web app framework

**Jade** is the template engine for Node.js

**Bootstrap** is a mobile first front-end framework

**D3** a JavaScript library for visualizing data

**Leaflet** a JavaScript library for visualizing data

---

Set up swarm master-

> **docker-machine create -d amazonec2 --swarm --swarm-master --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-master**

Set up swarm containers for nodes and databases-

> **docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-node-1**

> **docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-node-2**

> **docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-db-1**

> **docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-db-1-1**

MongoDB Configuration-

*Create dir and key-file*

> root@alantai*:/# mkdir -p /my_app/data

> root@alantai*:/# cd /my_app

> root@alantai*:/# openssl rand -base64 741 > mongodb-keyfile

> root@alantai*:/# chmod 600 mongodb-keyfile

> root@alantai*:/# sudo chown 999 mongodb-keyfile
  
*Create containers*
  
> root@alantai:/# docker run --name my_mongo -v /my_app/data:/data/db -v /my_app:/opt/keyfile --hostname="{PRIMARY_DB_IP}" -p 27017:27017 -d mongo --smallfiles

*Configure Primary DB*
> root@alantai:/# docker exec -it mongo /bin/bash

> root@alantai:/# mongo

> \> use admin

> \> db.createUser( {
     user: "siteUserAdmin",
     pwd: "YOUR_PASSWORD",
     roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
   });
