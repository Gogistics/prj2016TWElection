###Docker Swarm Tutorial

In this tutorial, a consul, a primary manager, secondary manager, and two nodes will be created in a docker swarm.

**The consul and the primary manager will be created in the instance with IP 45.79.106.150**

**The secondary manager will be created in the instance with IP 45.56.85.129**

**One node will be created in the instance with IP 198.74.48.34, and the other node will be created in the instance with IP 45.33.61.89**

------

-> 1. set discovery back-end (45.79.106.150):

$ docker run -d -p 8500:8500 --name=consul progrium/consul -server -bootstrap

-> 2. set primary manager (45.79.106.150):

$ docker run -d -p 4000:4000 swarm manage -H :4000 --replication --advertise 45.79.106.150:4000 consul://45.79.106.150:8500

-> 3. set secondary manager (45.56.85.129):

$ docker run -d -p 4000:4000 swarm manage -H :4000 --replication --advertise 45.56.85.129:4000 consul://45.79.106.150:8500

-> 4. set node-1 and node-2 respectively on 198.74.48.34 and 45.33.61.89:

$ docker run -d swarm join --advertise=198.74.48.34:2375 consul://45.79.106.150:8500

$ docker run -d swarm join --advertise=45.33.61.89:2375 consul://45.79.106.150:8500

5. Go back to the instance, 45.79.106.150, and check the status of swarm

$ docker -H :4000 info
