FROM node:16-alpine as builder

WORKDIR /usr/aicrag

COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY babel.config.js .
COPY .graphqlrc.yml .
COPY .env .
COPY ./src ./src
RUN yarn build

FROM node:16-alpine as production
WORKDIR /usr/aicrag
COPY --from=builder /usr/aicrag/yarn.lock .
COPY --from=builder /usr/aicrag/package.json .
COPY --from=builder /usr/aicrag/dist .
COPY --from=builder /usr/aicrag/.env .
RUN yarn install --prod
EXPOSE 4000

CMD ["yarn", "start"]
