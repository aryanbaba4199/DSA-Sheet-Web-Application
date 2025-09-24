
FROM node:20-slim as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:20-slim

WORKDIR /usr/src/app


RUN npm install -g serve

COPY --from=build /usr/src/app/dist ./dist

ENV PORT=8080
EXPOSE 8080


CMD ["serve", "-s", "dist", "-l", "8080"]