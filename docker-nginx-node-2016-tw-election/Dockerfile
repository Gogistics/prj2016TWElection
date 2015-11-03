# my nodejs server
FROM    debian:stable

# File Author / Maintainer
MAINTAINER Alan Tai

RUN      apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -yq curl
RUN		 DEBIAN_FRONTEND=noninteractive apt-get install -yq apt-utils
RUN      curl -sL https://deb.nodesource.com/setup | bash -
RUN      DEBIAN_FRONTEND=noninteractive apt-get install -yq nodejs
RUN		 apt-get install -yq git
RUN		 apt-get update
RUN		 apt-get clean
RUN		 npm install forever -g

# App
ADD . /web
# Install app dependencies
RUN cd /web && npm install && npm install -g bower
RUN cd /web && bower install --allow-root

EXPOSE  8080
CMD ["node", "/web/index.js"]
