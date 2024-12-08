FROM node:18 AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  fi

RUN npm install nodemon --save-dev

FROM base AS builder
WORKDIR /app
RUN npm install
COPY . .

COPY .env .env
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/ ./

EXPOSE 3002

ENV PORT=3002

CMD ["npm", "run", "start:prod"]
