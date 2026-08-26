import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { fetchCalculation } from './services/apiService';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

vi.mock('./services/apiService', () => ({
  fetchCalculation: vi.fn(),
}));

const mockedFetch = vi.mocked(fetchCalculation);

// Helper to read the current display value (avoids ambiguity with
// number buttons that show the same digits as the display).
const getDisplayValue = () => {
  const display = document.querySelector('.current');
  return display?.textContent ?? '';
};

describe('App', () => {
  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it('renders "0" on the display initially', () => {
    render(<App />);
    expect(getDisplayValue()).toBe('0');
  });

  it('updates the display when number buttons are clicked', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '3' }));

    expect(getDisplayValue()).toBe('123');
  });

  it('shows the previous value and operation symbol after pressing an operator', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '7' }));
    await user.click(screen.getByRole('button', { name: '+' }));

    const history = document.querySelector('.history');
    expect(history?.textContent).toContain('7');
    expect(history?.textContent).toContain('+');
  });

  it('shows the calculated result when "=" is pressed', async () => {
    mockedFetch.mockResolvedValueOnce(8);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(getDisplayValue()).toBe('8');
    expect(mockedFetch).toHaveBeenCalledWith('5', '3', 'add');
  });

  it('resets the display when "C" is pressed', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '9' }));
    expect(getDisplayValue()).toBe('9');

    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(getDisplayValue()).toBe('0');
  });

  it('shows "Error" on the display and an error toast when the calculation fails', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('Cannot divide by zero'));
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '÷' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(getDisplayValue()).toBe('Error');
    expect(screen.getByText('Cannot divide by zero')).toBeInTheDocument();
  });

  it('clears the error state when a number is pressed after an error', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('Cannot divide by zero'));
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '÷' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(getDisplayValue()).toBe('Error');

    await user.click(screen.getByRole('button', { name: '7' }));

    expect(getDisplayValue()).toBe('7');
    expect(screen.queryByText('Cannot divide by zero')).not.toBeInTheDocument();
  });

  it('handles the sqrt operation', async () => {
    mockedFetch.mockResolvedValueOnce(3);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '9' }));
    await user.click(screen.getByRole('button', { name: '^1/2' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(getDisplayValue()).toBe('3');
  });

  it('chains multiple operations correctly', async () => {
    mockedFetch
      .mockResolvedValueOnce(8) // 5 + 3
      .mockResolvedValueOnce(16); // 8 * 2

    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '×' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(mockedFetch).toHaveBeenNthCalledWith(1, '5', '3', 'add');
    expect(mockedFetch).toHaveBeenNthCalledWith(2, '8', '2', 'multiply');
    expect(getDisplayValue()).toBe('16');
  });
  it('clicks all remaining number buttons not yet covered', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: '8' }));
  await user.click(screen.getByRole('button', { name: '4' }));
  await user.click(screen.getByRole('button', { name: '6' }));

  expect(getDisplayValue()).toBe('846');
});

  it('handles the decimal comma button', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '1' }));
    await user.click(screen.getByRole('button', { name: ',' }));
    await user.click(screen.getByRole('button', { name: '5' }));

    expect(getDisplayValue()).toBe('1.5');
  });

  it('handles the subtract operation', async () => {
    mockedFetch.mockResolvedValueOnce(2);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '−' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(mockedFetch).toHaveBeenCalledWith('5', '3', 'subtract');
    expect(getDisplayValue()).toBe('2');
  });

  it('handles the exponentiate operation', async () => {
    mockedFetch.mockResolvedValueOnce(8);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '^x' }));
    await user.click(screen.getByRole('button', { name: '3' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(mockedFetch).toHaveBeenCalledWith('2', '3', 'exponentiate');
    expect(getDisplayValue()).toBe('8');
  });

  it('handles the percentage operation', async () => {
    mockedFetch.mockResolvedValueOnce(50);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '0' }));
    await user.click(screen.getByRole('button', { name: '%' }));
    await user.click(screen.getByRole('button', { name: '2' }));
    await user.click(screen.getByRole('button', { name: '=' }));

    expect(mockedFetch).toHaveBeenCalledWith('50', '2', 'percentage');
    expect(getDisplayValue()).toBe('50');
  });
});