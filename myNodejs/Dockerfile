# Node.js Server

# Set the base image to Ubuntu
FROM ubuntu

# file author
MAINTAINER ALAN TAI

#
RUN apt-get update && \
	apt-get -y install curl && \
	curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install python build-essential nodejs

# install nodemon
RUN npm install -g nodemon

# provides caches layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /src && cp -a /tmpnode_modules /src/

# define
WORKDIR /src
ADD . /src

# expose port
EXPOSE 8080

# 
CMD ["nodemon", "/src/index.js"]