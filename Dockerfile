FROM node:16-alpine

# Setting working directory. All the path will be relative to WORKDIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copying source files
COPY . /usr/src/app

# Install dependecies
RUN npm install

# Running the app
EXPOSE 4300
CMD npm run dev