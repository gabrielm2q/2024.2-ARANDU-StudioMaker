FROM node:22-alpine

COPY package*.json ./

COPY .env .env

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

ENV PORT=3002

CMD ["npm", "run", "start:dev"]
