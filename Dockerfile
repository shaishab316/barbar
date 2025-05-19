FROM node:22.13.0

WORKDIR /app

COPY package.json  .

RUN  npm install

COPY . .

EXPOSE 3000

# Build or run your app
CMD ["npm","run","dev"]