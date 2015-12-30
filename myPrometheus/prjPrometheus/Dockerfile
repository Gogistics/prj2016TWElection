# my Container exporter
FROM  prom/prometheus

# author
MAINTAINER Alan Tai <gogistics@gogistics-tw.com>

# copy files into container
COPY  alert.rules prometheus.yml /prometheus/

CMD  -config.file=/prometheus/prometheus.yml -alertmanager.url=http://45.33.61.89:9093