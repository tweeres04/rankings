FROM node:lts-alpine

EXPOSE 3000
WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

CMD ["npx", "serve", "-s", "build"]