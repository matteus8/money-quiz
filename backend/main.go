// backend/main.go

package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"golang.org/x/net/context"
)

var rdb *redis.Client

func main() {
	// Connect to the Redis server
	setupRedis()

	// Create a Gin router
	router := gin.Default()

	// Define API routes
	router.GET("/api/questions", getQuestions)
	router.POST("/api/submit-answer", submitAnswer)
	router.GET("/api/results", getResults)

	// Run the server
	port := 8080
	err := router.Run(fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRedis() {
	// Initialize the Redis client
	rdb = redis.NewClient(&redis.Options{
		Addr:     "redis:6379", // Use the hostname defined in your Docker Compose or Kubernetes configuration
		Password: "",           // No password for local development, use a password in production
		DB:       0,            // Default DB
	})

	// Ping the Redis server to check the connection
	ctx := context.Background()
	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	log.Println("Connected to Redis")
}

func getQuestions(c *gin.Context) {
	// TODO: Implement fetching questions from Redis or another data source
	c.JSON(http.StatusOK, gin.H{"message": "Get questions endpoint"})
}

func submitAnswer(c *gin.Context) {
	// TODO: Implement handling submitted answers and saving them to Redis or another data source
	c.JSON(http.StatusOK, gin.H{"message": "Submit answer endpoint"})
}

func getResults(c *gin.Context) {
	// TODO: Implement fetching results from Redis or another data source
	c.JSON(http.StatusOK, gin.H{"message": "Get results endpoint"})
}
