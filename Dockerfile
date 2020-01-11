FROM node:alpine
WORKDIR /usr/src/accountman
COPY . .
RUN npm install && npm run build
EXPOSE 6672
CMD ["node", "."]