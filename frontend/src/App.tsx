import { useCalculator } from './hooks/useCalculator';
import './App.css';

// Diccionario puro para limpiar el JSX
const OPERATION_SYMBOLS: Record<string, string> = {
  add: '+',
  subtract: '-',
  multiply: '×',
  divide: '÷',
  percentage: '%',
  exponentiate: '^x',
  sqrt: '^1/2'
};

function App() {
  // Inyección de dependencias a través del Custom Hook
  const {
    currentValue,
    previousValue,
    operation,
    error,
    handleNumber,
    handleOperation,
    handleEqual,
    handleClear
  } = useCalculator();

  return (
    <div className="calculator-wrapper">
      <div className="calculator">
        <div className="display">
          <div className="history">
            {previousValue} {operation ? OPERATION_SYMBOLS[operation] : ''}
          </div>
          <div className="current" style={{ color: error ? '#ff4a4a' : 'white' }}>
            {error ? 'Error' : currentValue}
          </div>
        </div>
        
        <div className="keypad">
          <button className="btn-secondary" onClick={handleClear}>C</button>
          <button className="btn-secondary" onClick={() => handleOperation('sqrt')}>^1/2</button>
          <button className="btn-secondary" onClick={() => handleOperation('percentage')}>%</button>
          <button className="btn-operator" onClick={() => handleOperation('divide')}>÷</button>
          
          <button className="btn-number" onClick={() => handleNumber('7')}>7</button>
          <button className="btn-number" onClick={() => handleNumber('8')}>8</button>
          <button className="btn-number" onClick={() => handleNumber('9')}>9</button>
          <button className="btn-operator" onClick={() => handleOperation('multiply')}>×</button>
          
          <button className="btn-number" onClick={() => handleNumber('4')}>4</button>
          <button className="btn-number" onClick={() => handleNumber('5')}>5</button>
          <button className="btn-number" onClick={() => handleNumber('6')}>6</button>
          <button className="btn-operator" onClick={() => handleOperation('subtract')}>−</button>
          
          <button className="btn-number" onClick={() => handleNumber('1')}>1</button>
          <button className="btn-number" onClick={() => handleNumber('2')}>2</button>
          <button className="btn-number" onClick={() => handleNumber('3')}>3</button>
          <button className="btn-operator" onClick={() => handleOperation('add')}>+</button>
          
          <button className="btn-operator" onClick={() => handleOperation('exponentiate')}>^x</button>
          <button className="btn-number" onClick={() => handleNumber('0')}>0</button>
          <button className="btn-number" onClick={() => handleNumber('.')}>,</button>
          <button className="btn-accent" onClick={handleEqual}>=</button>
        </div>
      </div>
      {error && <div className="error-toast">{error}</div>}
    </div>
  );
}

export default App;