# my nodejs server
FROM    debian:stable

# File Author / Maintainer
MAINTAINER Alan Tai <gogistics@gogistics-tw.com>

# run commands
RUN    apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -yq curl
RUN    DEBIAN_FRONTEND=noninteractive apt-get install -yq apt-utils
RUN    curl -sL https://deb.nodesource.com/setup | bash -
RUN    DEBIAN_FRONTEND=noninteractive apt-get install -yq nodejs git git-core build-essential
RUN    apt-get update
RUN    apt-get clean

# add files to working dir
COPY my_dicts/ /web/my_dicts
COPY public/ /web/public
COPY routes/ /web/routes
COPY tw_topo/ /web/tw_topo
COPY views/ /web/views
COPY bower.json main.js package.json Gruntfile.js start.sh /web/

# Install app dependencies
RUN cd /web && npm update -g npm && npm install && npm install -g bower --save-dev && npm install -g grunt --save-dev && npm install -g grunt-cli --save-dev && bower install --allow-root && grunt --force

# working dir
WORKDIR /web

EXPOSE  8080
CMD sh ./start.sh
