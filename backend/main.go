package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/lib/pq"
)

// GradeRequestBody represents the structure of the incoming request body
type GradeRequestBody struct {
	Grade string `json:"grade"`
}

// Database connection parameters
const (
	dbHost     = "157.230.48.116" // Update with your PostgreSQL host IP
	dbPort     = 5432             // Default PostgreSQL port
	dbUser     = "postgresql"     // Replace with your PostgreSQL user
	dbPassword = "admin123"       // Replace with your PostgreSQL password
	dbName     = "postgres"       // Replace with your PostgreSQL database name
)

func main() {
	// Define an HTTP handler for the /saveGrade endpoint
	http.HandleFunc("/saveGrade", saveGradeHandler)

	// Start the HTTP server on port 8080
	// Note: In a Kubernetes cluster, the port might be dynamically assigned
	// based on your Service configuration.
	fmt.Println("Server listening on :8080...")
	http.ListenAndServe(":8080", nil)
}

func saveGradeHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS (Cross-Origin Resource Sharing) to allow requests from any origin
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight requests (OPTIONS) to allow CORS
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Parse the request body to extract the grade
	var requestBody GradeRequestBody
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		// Return a 400 Bad Request response if the request body cannot be parsed
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	// Now you have the grade in requestBody.Grade
	grade := requestBody.Grade
	fmt.Printf("Received grade: %s\n", grade)

	// Save the grade to the PostgreSQL database
	err = saveGradeToDatabase(grade)
	if err != nil {
		// Return a 500 Internal Server Error if there's an issue with the database
		http.Error(w, "Failed to save grade to the database", http.StatusInternalServerError)
		return
	}

	// Respond to the frontend with a success message and the received grade
	response := map[string]string{"status": "success", "grade": grade}
	json.NewEncoder(w).Encode(response)
}

func saveGradeToDatabase(grade string) error {
	// Create the database connection string
	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

	// Open a connection to the PostgreSQL database
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("failed to open database connection: %v", err)
	}
	defer db.Close()

	fmt.Println("Connected to the database")

	// Insert the grade into a 'grades' table
	_, err = db.Exec("INSERT INTO grades (grade) VALUES ($1)", grade)
	if err != nil {
		return fmt.Errorf("failed to insert grade into database: %v", err)
	}

	fmt.Printf("Grade '%s' saved to the database.\n", grade)
	return nil
}
