FROM node:alpine
WORKDIR /usr/src/accountman
COPY package.json .
RUN npm install && npm install tsc -g
RUN npm run-script build
COPY ./dist .
EXPOSE 6672
CMD ["node", "index.js"]