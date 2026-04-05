ARG ALPINE_VERSION=3.19

FROM node:20-alpine${ALPINE_VERSION} AS base

RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers make python3 && \
    npm install --quiet node-gyp -g

WORKDIR /app

# stage 2.1 - install build dependencies
FROM base AS builder
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# stage 2.2 - install only runtime modules dependency
FROM base AS builder-min
COPY package*.json .
RUN npm install --omit=dev

# stage 3 - minified build
FROM alpine:${ALPINE_VERSION} AS final-stage

ENV NODE_ENV=production 
WORKDIR /usr/src/app

RUN apk add --no-cache libstdc++ dumb-init && \
    addgroup -g 1000 node && \
    adduser -u 1000 -G node -s /bin/sh -D node && \
    chown node:node ./

COPY --from=builder /usr/local/bin/node /usr/local/bin/
COPY --from=builder /usr/local/bin/docker-entrypoint.sh /usr/local/bin/
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder-min --chown=node:node /app/node_modules ./node_modules

EXPOSE 4000
USER node
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["dumb-init", "node", "dist/src/main.js"]
