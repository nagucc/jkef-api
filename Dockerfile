FROM node:6.9.5-alpine

ADD package.json /app/
ADD src /app/src
ADD tools /app/tools
ADD LICENSE.txt /app/
WORKDIR /app
RUN npm install

EXPOSE 3000
CMD npm start
