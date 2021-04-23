FROM node:10
 
WORKDIR /frontend
  
COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000:3000

CMD [ "npm", "start" ]
