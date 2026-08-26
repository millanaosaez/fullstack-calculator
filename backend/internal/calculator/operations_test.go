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
		{"Normal Subtract", 10, 2, 8},
		{"Float Subtract", 5, 2.5, 2.5},
		{"Negative Subtract", -5, -2, -3},
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

func TestExponentiate(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		a    float64
		b    float64
		want float64
	}{
		{"Normal Exponentiate", 5, 2, 25},
		{"Float Exponentiate", 2.5, 2, 6.25},
		{"Negative Exponentiate", -5, 2, 25},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := calculator.Exponentiate(tt.a, tt.b)
			// TODO: update the condition below to compare got with tt.want.
			if got != tt.want {
				t.Errorf("Exponentiate() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestSquareRoot(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		a       float64
		want    float64
		wantErr bool
	}{
		{"Normal SquareRoot", 4, 2, false},
		{"Float SquareRoot", 1.6, 1.2649110640673518, false},
		{"Negative SquareRoot", -4, 0, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, gotErr := calculator.SquareRoot(tt.a)
			if gotErr != nil {
				if !tt.wantErr {
					t.Errorf("SquareRoot() failed: %v", gotErr)
				}
				return
			}
			if tt.wantErr {
				t.Fatal("SquareRoot() succeeded unexpectedly")
			}

			if got != tt.want {
				t.Errorf("SquareRoot() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPercentage(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for target function.
		a    float64
		want float64
	}{
		{"Normal Percentage", 80, 0.8},
		{"Negative Percentage", -80, -0.8},
		{"Percentage of 0", 0, 0},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := calculator.Percentage(tt.a)

			if got != tt.want {
				t.Errorf("Percentage() = %v, want %v", got, tt.want)
			}
		})
	}
}
