FROM node:25.8.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]