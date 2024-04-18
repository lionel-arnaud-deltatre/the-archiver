# Use an official Node.js runtime as a parent image
FROM node:latest

# Copy the package.json and package-lock.json (if available)
COPY ./ /

# Specify the command to run on container startup
ENTRYPOINT ["/start.sh"]
