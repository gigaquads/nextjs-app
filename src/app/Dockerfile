# syntax=docker/dockerfile:1
# Next.js development server container

FROM node:16.13.1-alpine3.14
RUN apk add --no-cache bash
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
RUN yarn install -d
COPY . .
EXPOSE 3000
CMD ["./wait-for-it.sh", "db:5432", "--", "yarn", "run", "docker:start"]
