package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"calculator-api/internal/calculator"
)

// respondWithError standarizes error responses to JSON.
func respondWithError(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// CalculatorHandler processes GET petitions.
func CalculatorHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method != http.MethodGet {
		respondWithError(w, http.StatusMethodNotAllowed, "Método no permitido")
		return
	}

	// Extract URL Parameters
	aStr := r.URL.Query().Get("a")
	bStr := r.URL.Query().Get("b")
	operation := r.URL.Query().Get("operation")

	// Validates and parses 'a'
	a, err := strconv.ParseFloat(aStr, 64)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "El parámetro 'a' debe ser un número válido")
		return
	}

	// Validates and parses 'b'
	b, err := strconv.ParseFloat(bStr, 64)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "El parámetro 'b' debe ser un número válido")
		return
	}

	var result float64

	switch operation {
	case "add":
		result = calculator.Add(a, b)
	case "substract":
		result = calculator.Subtract(a, b)
	case "multiply":
		result = calculator.Multiply(a, b)
	case "divide":
		res, err := calculator.Divide(a, b)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}
		result = res
	default:
		respondWithError(w, http.StatusBadRequest, "Operación no soportada")
		return
	}
	// Responds with success in JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]float64{"result": result})
}
