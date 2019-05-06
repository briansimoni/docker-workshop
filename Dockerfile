# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md

# A specific LTS version of node.js should be picked
# Accompanied with an alpine image, this is an ideal base image for a final production image.
FROM node:10.15.3-alpine as builder

# If needed, you can use the http and https proxy build variables if you're on a corporate network
# docker build --build-arg http_proxy=${http_proxy} --build-arg https_proxy=${https_proxy} . -t cool-image
ARG https_proxy
ARG http_proxy

ADD . /app
WORKDIR /app

# Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache --virtual .gyp python make g++
RUN npm install

# Copy built node modules and binaries without including the toolchain
FROM node:10.15.3-alpine as app
COPY --from=builder /app/node_modules /app
CMD node src/server.js