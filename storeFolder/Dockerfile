# Use an official Node.js runtime as a parent image
FROM node

# Set the working directory in the container
WORKDIR /action/workspace

# Copy the package.json and package-lock.json (if available)
COPY . /action/workspace

# Install any necessary dependencies
RUN npm install --only=production

# Specify the command to run on container startup
ENTRYPOINT ["node", "index.js"]
