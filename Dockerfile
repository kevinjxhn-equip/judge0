# Build the React App
FROM node:14 as build
WORKDIR /app
COPY ./judge0-monaco/client/package*.json ./
RUN npm install
COPY ./judge0-monaco/client/ ./
RUN npm run build

# Set up the Node.js server
FROM node:14
WORKDIR /usr/src/app
COPY ./judge0-monaco/server/package*.json ./
RUN npm install
COPY ./judge0-monaco/server/ ./
COPY --from=build /app/build ./judge0-monaco/client/build

# Expose the ports and start the server
EXPOSE 3000 5173
CMD [ "node", "server.js" ]