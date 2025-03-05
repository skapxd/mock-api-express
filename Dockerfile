# Base image
FROM node:20-alpine
# FROM node:18-bullseye 

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# RUN apt-get install curl libcurl3

# Install app dependencies
RUN corepack enable yarn
RUN yarn 

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn build

# Start the server using the production build
# command to run image -> docker run -p 3000:3000 [full-tag-name]
CMD [ "yarn", "dev" ]
