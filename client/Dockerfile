FROM node:25.8.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

CMD [ "npm", "run", "dev", "--host", "0.0.0.0"]