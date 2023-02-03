FROM node:14.15.4-alpine

WORKDIR /usr/app

COPY ./ ./

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:production"]