# Use an official Node.js runtime as a parent image
FROM node:14-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install any necessary dependencies
RUN npm install --only=production

# Copy the rest of your action's code
COPY . .

# Specify the command to run on container startup
ENTRYPOINT ["node", "index.js"]
