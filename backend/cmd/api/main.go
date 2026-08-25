package main

import (
	"fmt"
	"log"
	"net/http"

	"calculator-api/internal/handler"
)

func main() {

	http.HandleFunc("/api/v1/calculate", handler.CalculatorHandler)

	fmt.Println("Iniciando el servidor REST en el puerto 8080...")

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Error crítico al iniciar el servidor: ", err)
	}
}
