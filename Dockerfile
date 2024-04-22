# Use an official Node.js runtime as a parent image
FROM node:latest

# Setting the working directory
WORKDIR /usr/src/app

# Copy package.json and other dependency files
COPY package*.json ./

# Copy your application files
COPY . .

# Install dependencies
RUN npm install

# Make sure the script is executable and set it as the entrypoint
# COPY start.sh /start.sh
RUN chmod +x /start.sh
RUN chmod +x /workflows/commit.sh
ENTRYPOINT ["/start.sh"]
