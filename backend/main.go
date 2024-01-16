package main

import (
	"encoding/json"
	"net/http"
)

// GradeRequestBody represents the structure of the incoming request body
type GradeRequestBody struct {
	Grade string `json:"grade"`
}

func main() {
	http.HandleFunc("/saveGrade", saveGradeHandler)
	http.ListenAndServe(":8080", nil)
}

func saveGradeHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var requestBody GradeRequestBody
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	// Now you have the grade in requestBody.Grade
	grade := requestBody.Grade

	// Add your logic to save the grade to the database here
	// (You might use a database driver for PostgreSQL)

	// Respond to the frontend
	response := map[string]string{"status": "success", "grade": grade}
	json.NewEncoder(w).Encode(response)
}
