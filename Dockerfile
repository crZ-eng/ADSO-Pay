FROM node:20-alpine

RUN apk add --no-cache bash git

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["npm", "start"]