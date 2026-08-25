package calculator_test

import (
	"calculator-api/internal/calculator"
	"testing"
)

func TestDivide(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		a       float64
		b       float64
		want    float64
		wantErr bool
	}{
		{"Normal Division", 10, 2, 5, false},
		{"Float Division", 5, 2, 2.5, false},
		{"Cero Division", 10, 0, 0, true},
		{"Negative Num Division", -10, -2, 5, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, gotErr := calculator.Divide(tt.a, tt.b)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("Divide() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("Divide() succeeded unexpectedly")
			}

			if got != tt.want {
				t.Errorf("Divide() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestAdd(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		a    float64
		b    float64
		want float64
	}{
		{"Normal Add", 5, 2, 7},
		{"Float Add", 2.5, 1.5, 4},
		{"Negative Add", 5, -4, 1},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := calculator.Add(tt.a, tt.b)

			if got != tt.want {
				t.Errorf("Add() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestSubtract(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		a    float64
		b    float64
		want float64
	}{
		{"Normal Substract", 10, 2, 8},
		{"Float Substract", 5, 2.5, 2.5},
		{"Negative Substract", -5, -2, -3},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := calculator.Subtract(tt.a, tt.b)

			if got != tt.want {
				t.Errorf("Subtract() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestMultiply(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		a    float64
		b    float64
		want float64
	}{
		{"Normal Multiply", 5, 2, 10},
		{"Float Multiply", 2.5, 2, 5},
		{"Negative Multiply", 10, -2, -20},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := calculator.Multiply(tt.a, tt.b)

			if got != tt.want {
				t.Errorf("Multiply() = %v, want %v", got, tt.want)
			}
		})
	}
}
