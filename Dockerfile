FROM node:boron
WORKDIR /usr/src/app
ADD ks /usr/src/app/ks
ADD ks-a /usr/src/app/ks-a
COPY package.json .
RUN npm run deploy
EXPOSE 3000
CMD [ "npm", "start" ]

