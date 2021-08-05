FROM node:fermium-alpine

RUN mkdir -p /app
WORKDIR /srv/app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

USER node

CMD [ "npm", "start" ]

