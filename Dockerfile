FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG PUBLIC_DB_CONNECT
ENV PUBLIC_DB_CONNECT=$PUBLIC_DB_CONNECT

RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]