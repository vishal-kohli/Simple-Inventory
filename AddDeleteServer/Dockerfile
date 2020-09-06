FROM node:alpine

#setting work directory
# RUN mkdir -p /app

WORKDIR /app    

#copying only package.json first, so cache can be used for minor changes
COPY package*.json ./
RUN npm install

# copy rest of files
COPY . .

CMD ["npm", "run","start"]