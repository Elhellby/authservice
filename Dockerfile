FROM node:18.7.0
WORKDIR /src
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .
CMD [ "node", "src/app.js" ]