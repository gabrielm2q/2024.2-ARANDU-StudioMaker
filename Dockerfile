FROM node:22-alpine

WORKDIR /app


COPY package*.json ./

COPY .env .env
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
