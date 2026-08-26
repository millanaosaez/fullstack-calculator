// apiService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCalculation } from './apiService';

describe('fetchCalculation', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('builds the correct URL with a and b for binary operations', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 8 }),
    });

    await fetchCalculation('5', '3', 'add');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/calculate?a=5&b=3&operation=add'
    );
  });

  it('builds the URL with only "a" for the unary sqrt operation', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 3 }),
    });

    await fetchCalculation('9', '0', 'sqrt');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/calculate?a=9&operation=sqrt'
    );
  });

  it('returns the numeric result on a successful response', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 42 }),
    });

    const result = await fetchCalculation('40', '2', 'add');

    expect(result).toBe(42);
  });

  it('throws the server-provided error message when the response is not ok', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Cannot divide by zero' }),
    });

    await expect(fetchCalculation('5', '0', 'divide')).rejects.toThrow(
      'Cannot divide by zero'
    );
  });

  it('throws a status-based fallback message when the error body is not valid JSON', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => {
        throw new SyntaxError('Unexpected token');
      },
    });

    await expect(fetchCalculation('5', '3', 'add')).rejects.toThrow(
      'Server error (502)'
    );
  });

  it('throws the underlying message when fetch itself rejects (network error)', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new TypeError('Failed to fetch')
    );

    await expect(fetchCalculation('5', '3', 'add')).rejects.toThrow(
      'Failed to fetch'
    );
  });

  it('throws a generic fallback message when a non-Error value is thrown', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce('something odd');

    await expect(fetchCalculation('5', '3', 'add')).rejects.toThrow(
      'Server connection error'
    );
  });

  it('works correctly for each supported binary operation', async () => {
    const operations: Array<[string, string, string]> = [
      ['add', '2', '3'],
      ['subtract', '5', '2'],
      ['multiply', '4', '3'],
      ['divide', '10', '2'],
      ['exponentiate', '2', '3'],
    ];

    for (const [operation, a, b] of operations) {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 1 }),
      });

      await fetchCalculation(a, b, operation as Parameters<typeof fetchCalculation>[2]);

      expect(global.fetch).toHaveBeenLastCalledWith(
        `http://localhost:8080/api/v1/calculate?a=${a}&b=${b}&operation=${operation}`
      );
    }
  });
});