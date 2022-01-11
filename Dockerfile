FROM node:16-alpine

WORKDIR /usr/aicrag

COPY package.json /usr/aicrag/
RUN yarn install --prod

COPY ./dist/ /usr/aicrag/dist/
COPY .env /usr/aicrag/

CMD ["yarn", "start"]
