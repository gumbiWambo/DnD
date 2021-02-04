FROM node:13.14-alpine3.11
EXPOSE 8080
EXPOSE 1337
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .




CMD ["npm", "run", "start:dev"]