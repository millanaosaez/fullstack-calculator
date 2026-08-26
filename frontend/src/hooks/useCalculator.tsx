import { useState } from 'react';
import { fetchCalculation } from '../services/apiService';
import type { Operation } from '../services/apiService';

export const useCalculator = () => {
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    setError(null);
    if (waitingForNewValue) {
      setCurrentValue(num);
      setWaitingForNewValue(false);
    } else {
      setCurrentValue(currentValue === '0' && num !== '.' ? num : currentValue + num);
    }
  };

  const executeCalculation = async (a: string, b: string, op: Operation): Promise<string | null> => {
    try {
      const data = await fetchCalculation(a, b, op);
      return data.toString();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network Error");
      return null;
    }
  };

  const handleOperation = async (op: Operation) => {
    setError(null);
    if (operation && previousValue && !waitingForNewValue) {
      const result = await executeCalculation(previousValue, currentValue, operation);
      if (result !== null) {
        setCurrentValue(result);
        setPreviousValue(result);
      }
    } else {
      setPreviousValue(currentValue);
    }
    setOperation(op);
    setWaitingForNewValue(true);
  };

  const handleEqual = async () => {
    if (!operation || !previousValue) return;
    const result = await executeCalculation(previousValue, currentValue, operation);
    if (result !== null) {
      setCurrentValue(result);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setCurrentValue('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setError(null);
  };

 
  return {
    currentValue,
    previousValue,
    operation,
    error,
    handleNumber,
    handleOperation,
    handleEqual,
    handleClear
  };
};