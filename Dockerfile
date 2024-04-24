# Use an official Node.js runtime as a parent image
FROM node:latest

# Install zip utility and curl
RUN apt-get update && apt-get install -y \
    zip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -f awscliv2.zip

# Verify installations
RUN aws --version
RUN zip --version

# Setting the working directory
WORKDIR /usr/src/app

# Copy package.json and other dependency files
COPY package*.json ./

# Copy your application files
COPY . ./

# Install dependencies
RUN npm install

# check what is available
RUN ls -l

# Make sure the script is executable and set it as the entrypoint
# COPY start.sh /start.sh
RUN chmod +x ./start.sh
RUN chmod +x ./resource/git_commit.sh
RUN chmod +x ./resource/zip_folder.sh
RUN chmod +x ./resource/aws_s3_upload.sh
RUN chmod +x ./resource/aws_s3_list.sh
ENTRYPOINT ["/usr/src/app/start.sh"]
