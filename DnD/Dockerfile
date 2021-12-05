FROM node:14.2.0-alpine3.11
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 4200