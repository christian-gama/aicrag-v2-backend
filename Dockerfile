FROM node:16-alpine as builder

WORKDIR /usr/aicrag

COPY package.json .
COPY yarn.lock .
COPY .env .
RUN yarn install
RUN yarn build

FROM node:16-alpine as production
WORKDIR /usr/aicrag
COPY --from=builder /usr/aicrag/yarn.lock .
COPY --from=builder /usr/aicrag/package.json .
COPY --from=builder /usr/aicrag/dist .
COPY --from=builder /usr/aicrag/.env .
RUN yarn install --prod

CMD ["yarn", "start"]
