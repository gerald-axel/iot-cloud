FROM node:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app
RUN npm install 

# Bundle app source
COPY . /app

EXPOSE 1883
EXPOSE 1884

CMD [ "npm", "start" ]