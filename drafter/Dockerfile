FROM node:lts-alpine

EXPOSE 3000
WORKDIR /app

COPY ./package.json .
RUN yarn

COPY . .

RUN yarn build

CMD ["npx", "serve", "-s", "build"]