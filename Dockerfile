# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md

# A specific LTS version of node.js should be picked
# Accompanied with an alpine image, this is an ideal base image for a final production image.
FROM node:10.15.3-alpine as builder

ADD . /app
WORKDIR /app

# Install build toolchain, install node deps and compile native add-ons
RUN apk add --no-cache --virtual .gyp python make g++
RUN npm install


# Copy built node modules and binaries without including the toolchain
FROM node:10.15.3-alpine as app
COPY --from=builder /app/node_modules /app

CMD node src/server.js