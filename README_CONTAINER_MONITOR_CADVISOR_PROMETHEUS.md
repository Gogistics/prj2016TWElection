# Configuration of container monitor with cAdvisor and Prometheus


cAdisor and Prometheus will be used to monitor the docker containers which are running on all instances

#####1. Set cAdvisor container

1. Create instance in which applications/databses containers will run

2. Run the following command:

$ sudo docker run --volume=/:/rootfs:ro --volume=/var/run:/var/run:rw --volume=/sys:/sys:ro --volume=/var/lib/docker/:/var/lib/docker:ro --publish=8080:8080 --detach=true --name=cadvisor google/cadvisor:latest

Ref. Links:
[cAdvisor Doc](https://github.com/google/cadvisor)

#####2. Set Prometheus

1. Create a folder for Prometheus, prometheus.yml, alert.rules, and alertmanager.conf

$ mkdir prometheus && cd prometheus && touch prometheus.yml && touch alert.rules && touch alertmanager.conf

2. Update prometheus.yml and alert.rules

$ nano prometheus.yml

...

$ nano alert.rules

...

$ nano alertmanager.conf

3. Run AlertManager as a service

$ docker run -d -p 9093:9093 -v $PWD/alertmanager.conf:/alertmanager.conf prom/alertmanager -config.file=/alertmanager.conf

4. Run Prometheus as a service

docker run -d -p 9090:9090 -v $PWD/prometheus.yml:/etc/prometheus/prometheus.yml -v $PWD/alert.rules:/etc/prometheus/alert.rules prom/prometheus -config.file=/etc/prometheus/prometheus.yml -alertmanager.url=http://192.168.59.103:9093

Note: The IP address http://192.168.59.103 is my Docker Host address.

Ref. Links:
[Official Doc](http://prometheus.io/docs/introduction/install/)
[Configuration Tutorial of cAdvisor and Prometheus](https://www.ctl.io/developers/blog/post/monitoring-docker-services-with-prometheus/)