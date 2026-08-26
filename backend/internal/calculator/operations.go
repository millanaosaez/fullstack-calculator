package calculator

import (
	"errors"
	"math"
)

func Add(a, b float64) float64 {
	return a + b
}

func Subtract(a, b float64) float64 {
	return a - b
}

func Multiply(a, b float64) float64 {
	return a * b
}

func Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("Can't divide by 0")
	}
	return a / b, nil
}

func Exponentiate(a, b float64) float64 {
	return math.Pow(a, b)
}

func SquareRoot(a float64) (float64, error) {
	if a < 0 {
		return 0, errors.New("Can't calculate square root of a negative number")
	}
	return math.Sqrt(a), nil
}

func Percentage(a float64) float64 {
	return a / 100
}
