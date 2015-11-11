# Project for 2016 TW Election

### Deployment of Virtual Machines on EC2 with Docker Swarm
This project is for analyzing the trend of 2016 Taiwan Election. The applications will be developed with the follwoing tools, libs, and so on:

**AWS EC2**

**Docker Swarm**

**MongoDB**

**Nginx**

**Node.js**

**Express**

**Jade**

**Bootstrap**

**D3**

**Leaflet**

---

Set up swarm master-

> **docker-machine create -d amazonec2 --swarm --swarm-master --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-master**

Set up swarm containers for nodes and databases-

> **docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-node-1**

> **docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-node-2**

> **docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-db-1**

> **docker-machine create -d amazonec2 --swarm --swarm-discovery token://{YOUR_TOKEN} --amazonec2-access-key {YOUR_ACCESS_KEY} --amazonec2-secret-key {YOUR_SECRET_KEY} --amazonec2-vpc-id {YOUR_VPC} --amazonec2-region us-west-2 swarm-db-1-1**
