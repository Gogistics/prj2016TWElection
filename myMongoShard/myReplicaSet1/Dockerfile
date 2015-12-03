# my twitter stream server
FROM    mongo

# File Author / Maintainer
MAINTAINER Alan Tai

RUN    apt-get update
RUN    DEBIAN_FRONTEND=noninteractive apt-get install -yq apt-utils git build-essential
RUN    apt-get update
RUN    apt-get clean

# create volume
VOLUME   /data/db

# add files to working dir
COPY   mongodb-keyfile /opt/keyfile/mongodb-keyfile

# Install app dependencies
RUN    cd /opt/keyfile && chmod 600 mongodb-keyfile && chown 999 mongodb-keyfile

EXPOSE  27017

#
CMD mongod --smallfiles --keyFile /opt/keyfile/mongodb-keyfile --replSet "rs1"
