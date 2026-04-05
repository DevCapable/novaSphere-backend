FROM node:lts as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli
COPY package*.json ./

# generated prisma files
# COPY prisma ./prisma

RUN npm install

COPY . .
COPY ./docker/run.sh /usr/bin/run.sh
RUN chmod +x /usr/bin/run.sh

CMD /usr/bin/run.sh
