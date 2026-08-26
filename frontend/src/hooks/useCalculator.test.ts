// useCalculator.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCalculator } from './useCalculator';
import { fetchCalculation } from '../services/apiService';

vi.mock('../services/apiService', () => ({
  fetchCalculation: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchCalculation);

describe('useCalculator', () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it('starts with currentValue "0" and no operation', () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.currentValue).toBe('0');
    expect(result.current.previousValue).toBeNull();
    expect(result.current.operation).toBeNull();
    expect(result.current.error).toBeNull();
  });

  describe('handleNumber', () => {
    it('replaces the initial "0" when a number is pressed', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.handleNumber('5'));
      expect(result.current.currentValue).toBe('5');
    });

    it('concatenates consecutive digits', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.handleNumber('1'));
      act(() => result.current.handleNumber('2'));
      act(() => result.current.handleNumber('3'));
      expect(result.current.currentValue).toBe('123');
    });

    it('keeps the leading zero when starting with "." (e.g. "0.5")', () => {
        const { result } = renderHook(() => useCalculator());
        act(() => result.current.handleNumber('.'));
        act(() => result.current.handleNumber('5'));
        expect(result.current.currentValue).toBe('0.5');
    });
  });

  describe('handleOperation', () => {
    it('moves currentValue into previousValue on the first operation', async () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleNumber('7');
      });

      await act(async () => {
        await result.current.handleOperation('add');
      });

      expect(result.current.previousValue).toBe('7');
      expect(result.current.operation).toBe('add');
    });

    it('chains operations by computing the intermediate result', async () => {
      mockedFetch.mockResolvedValueOnce(8); // 5 + 3
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleNumber('5');
      });

      await act(async () => {
        await result.current.handleOperation('add');
      });

      act(() => {
        result.current.handleNumber('3');
      });

      await act(async () => {
        await result.current.handleOperation('subtract');
      });

      expect(mockedFetch).toHaveBeenCalledWith('5', '3', 'add');
      expect(result.current.currentValue).toBe('8');
      expect(result.current.previousValue).toBe('8');
      expect(result.current.operation).toBe('subtract');
    });

    it('does not recalculate when switching operators without entering a new number', async () => {
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleNumber('5');
      });

      await act(async () => {
        await result.current.handleOperation('add');
      });

      await act(async () => {
        await result.current.handleOperation('subtract'); // switch operator, no new digit typed
      });

      expect(mockedFetch).not.toHaveBeenCalled();
      expect(result.current.operation).toBe('subtract');
      expect(result.current.previousValue).toBe('5');
    });

    it('sets an error if the intermediate calculation fails', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Cannot divide by zero'));
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleNumber('5');
      });

      await act(async () => {
        await result.current.handleOperation('divide');
      });

      act(() => {
        result.current.handleNumber('0');
      });

      await act(async () => {
        await result.current.handleOperation('add');
      });

      expect(result.current.error).toBe('Cannot divide by zero');
    });
  });

  describe('handleEqual', () => {
    it('does nothing when there is no pending operation', async () => {
      const { result } = renderHook(() => useCalculator());

      await act(async () => {
        await result.current.handleEqual();
      });

      expect(mockedFetch).not.toHaveBeenCalled();
      expect(result.current.currentValue).toBe('0');
    });

    it('computes the result and resets operation/previousValue', async () => {
      mockedFetch.mockResolvedValueOnce(15);
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleNumber('5');
      });

      await act(async () => {
        await result.current.handleOperation('multiply');
      });

      act(() => {
        result.current.handleNumber('3');
      });

      await act(async () => {
        await result.current.handleEqual();
      });

      expect(mockedFetch).toHaveBeenCalledWith('5', '3', 'multiply');
      expect(result.current.currentValue).toBe('15');
      expect(result.current.previousValue).toBeNull();
      expect(result.current.operation).toBeNull();
    });

    it('leaves currentValue unchanged and sets an error if the calculation fails', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Network error'));
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleNumber('5');
      });

      await act(async () => {
        await result.current.handleOperation('divide');
      });

      act(() => {
        result.current.handleNumber('0');
      });

      await act(async () => {
        await result.current.handleEqual();
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.currentValue).toBe('0'); // unchanged
      expect(result.current.operation).toBe('divide'); // not cleared
    });

    it('falls back to a generic message when the thrown value is not an Error instance', async () => {
      mockedFetch.mockRejectedValueOnce('something odd'); // not an Error
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleNumber('5');
      });

      await act(async () => {
        await result.current.handleOperation('divide');
      });

      act(() => {
        result.current.handleNumber('0');
      });

      await act(async () => {
        await result.current.handleEqual();
      });

      expect(result.current.error).toBe('Network Error');
    });
  });

  describe('handleClear', () => {
    it('resets all state back to initial values', async () => {
      mockedFetch.mockResolvedValueOnce(15);
      const { result } = renderHook(() => useCalculator());

      act(() => {
        result.current.handleNumber('5');
      });

      await act(async () => {
        await result.current.handleOperation('multiply');
      });

      act(() => {
        result.current.handleNumber('3');
      });

      await act(async () => {
        await result.current.handleEqual();
      });

      act(() => {
        result.current.handleClear();
      });

      expect(result.current.currentValue).toBe('0');
      expect(result.current.previousValue).toBeNull();
      expect(result.current.operation).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});