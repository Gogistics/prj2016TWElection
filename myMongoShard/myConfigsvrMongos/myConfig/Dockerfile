# my twitter stream server
FROM    mongo

# File Author / Maintainer
MAINTAINER Alan Tai <gogistics@gogistics-tw.com>

RUN    apt-get update
RUN    DEBIAN_FRONTEND=noninteractive apt-get install -yq apt-utils git build-essential
RUN    apt-get update
RUN    apt-get clean

# set volume
VOLUME   /data/configdb

# add files to working dir
COPY   ../../mongodb-keyfile /opt/keyfile/mongodb-keyfile

# Install app dependencies
RUN    cd /opt/keyfile && chmod 600 mongodb-keyfile && chown 999 mongodb-keyfile

EXPOSE  27019

#
CMD mongod --keyFile /opt/keyfile/mongodb-keyfile --configsvr
