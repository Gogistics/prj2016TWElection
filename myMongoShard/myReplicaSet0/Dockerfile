# my twitter stream server
FROM    mongo

# File Author / Maintainer
MAINTAINER Alan Tai <gogistics@gogistics-tw.com>

RUN    apt-get update
RUN    DEBIAN_FRONTEND=noninteractive apt-get install -yq apt-utils git build-essential
RUN    apt-get update
RUN    apt-get clean

# create volume; /data/db for replica set /data/arb for arbiter
VOLUME   /data/db
VOLUME   /data/arb

# add files to working dir
COPY   ./mongodb-keyfile /opt/keyfile/mongodb-keyfile

# Install app dependencies
RUN    cd /opt/keyfile && chmod 600 mongodb-keyfile && chown 999 mongodb-keyfile

EXPOSE  27017

# primary or secondary --dbpath /data/db ; arbiter --dbpath /data/arb
CMD mongod --noprealloc --smallfiles --keyFile /opt/keyfile/mongodb-keyfile --replSet "rs0"
