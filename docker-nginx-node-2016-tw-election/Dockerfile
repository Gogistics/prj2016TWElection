# my nodejs server
FROM    debian:stable

# File Author / Maintainer
MAINTAINER Alan Tai

# run commands
RUN      apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -yq curl
RUN		 DEBIAN_FRONTEND=noninteractive apt-get install -yq apt-utils
RUN      curl -sL https://deb.nodesource.com/setup | bash -
RUN      DEBIAN_FRONTEND=noninteractive apt-get install -yq nodejs
RUN		 DEBIAN_FRONTEND=noninteractive apt-get install -yq git
RUN		 DEBIAN_FRONTEND=noninteractive apt-get install -yq build-essential
RUN		 apt-get update
RUN		 apt-get clean
RUN		 npm install forever -g

# add files to working dir
COPY my_dicts/ /web/my_dicts
COPY public/ /web/public
COPY routes/ /web/routes
COPY tw_topo/ /web/tw_topo
COPY views/ /web/views
COPY bower.json main.js package.json /web/

# Install app dependencies
RUN cd /web && npm install && npm install -g bower
RUN cd /web && bower install --allow-root

# working dir
WORKDIR /web

EXPOSE  8080
CMD MY_MANDRILL_API_KEY=$MY_MANDRILL_API_KEY node ./main.js
