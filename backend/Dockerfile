FROM golang:latest

WORKDIR /app

# Initialize the Go module
RUN go mod init myapp

# Install the required package for PostgreSQL
RUN go get github.com/lib/pq

COPY . .

# Build the backend application
RUN go build -o main .

EXPOSE 80

# Run the backend application
CMD ["./main"]




