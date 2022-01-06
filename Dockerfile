FROM node:16-alpine

WORKDIR /usr/aicrag

COPY package.json /usr/aicrag/
RUN npm install --only=prod

COPY ./dist/ /usr/aicrag/dist/
COPY config.env /usr/aicrag/

CMD ["npm", "run", "dev:docker"]
