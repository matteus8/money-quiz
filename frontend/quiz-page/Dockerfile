# Use an official lightweight Node.js image
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy all files to the working directory
COPY . .


# Install http-server globally
RUN npm install -g http-server

# Expose the port the app runs on
EXPOSE 8080

# Command to run your application
CMD ["http-server", "-p", "8080"]
