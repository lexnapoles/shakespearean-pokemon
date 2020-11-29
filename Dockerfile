## Build

FROM node:14.15.1-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

## Run

FROM node:14.15.1-alpine AS server
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
EXPOSE 3000
CMD npm run serve

