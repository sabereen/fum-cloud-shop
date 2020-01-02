FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install & npm run build
COPY . /usr/src/app
EXPOSE 6672
CMD ["npm", "start"]