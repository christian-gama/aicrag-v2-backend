############
# Build
FROM node:16-alpine as builder
WORKDIR /usr/aicrag
RUN npm install -g pnpm
RUN pnpm add -g pnpm
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --unsafe-perm
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY babel.config.js .
COPY .graphqlrc.yml .
COPY .env .
COPY ./src ./src
RUN pnpm build

############
# Production
FROM node:16-alpine
WORKDIR /usr/aicrag
RUN npm install -g pnpm
RUN pnpm add -g pnpm
COPY --from=builder /usr/aicrag/pnpm-lock.yaml .
COPY --from=builder /usr/aicrag/package.json .
COPY --from=builder /usr/aicrag/dist ./dist
COPY --from=builder /usr/aicrag/.env .
RUN pnpm install --production --unsafe-perm
CMD ["pnpm", "start"]
