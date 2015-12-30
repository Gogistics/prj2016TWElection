# my Container exporter
FROM  prom/alertmanager

# author
MAINTAINER Alan Tai <gogistics@gogistics-tw.com>

# copy files into container
COPY  alertmanager.conf /alertmanager/

# command
CMD  -config.file=/alertmanager/alertmanager.conf