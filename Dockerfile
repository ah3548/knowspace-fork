FROM node:boron
WORKDIR /usr/src/app
COPY package.json .
RUN npm run deploy
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]

