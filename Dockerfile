FROM node:22

WORKDIR /src

COPY package*.json ./

RUN npm install nodemon --save-dev

RUN npm install

COPY . .
COPY .env .env

RUN npm run build

EXPOSE 3002

ENV PORT 3002

CMD ["npm", "run", "start:prod"]
