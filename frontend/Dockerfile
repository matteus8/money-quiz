# Use Python image with Alpine Linux
FROM python:3.13-rc-alpine3.19

# Set the working directory to /app
WORKDIR /app

# Install Flask
RUN pip install Flask

# Install Node.js and npm (included in the node image)
RUN apk add --no-cache nodejs npm

# Install Axios
RUN npm install axios

# Copy the current directory contents into the container at /app
COPY . /app

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run app.py when the container launches
CMD ["python", "frontend-app.py", "--host", "0.0.0.0", "--port", "8080"]
