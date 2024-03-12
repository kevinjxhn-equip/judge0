# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY judge0-monaco/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code to the working directory
COPY judge0-monaco/ .

# Build the React app
RUN npm run build

# Copy server files
COPY judge0-monaco/server/ ./server/

# Expose the port that the Express server will run on
EXPOSE 3000

# Start the Express server
CMD [ "node", "server/server.js" ]