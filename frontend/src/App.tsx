import { useState } from 'react';
import { fetchCalculation } from './services/apiService';
import type { Operation } from './services/apiService';
import './App.css'; 

function App() {
  
  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  
  const handleCalculate = async () => {
    
    setResult(null);
    setError(null);

    
    if (!a || !b) {
      setError("Por favor, ingrese ambos números.");
      return;
    }

    try {
      
      const data = await fetchCalculation(a, b, operation);
      setResult(data);
    } catch (err) {
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  
  return (
    <div className="calculator-container">
      <h1>FullStack Calculator</h1>
      
      <div className="inputs">
        <input 
          type="number" 
          value={a} 
          onChange={(e) => setA(e.target.value)} 
          placeholder="Número A"
        />
        
        <select value={operation} onChange={(e) => setOperation(e.target.value as Operation)}>
          <option value="add">Sumar (+)</option>
          <option value="subtract">Restar (-)</option>
          <option value="multiply">Multiplicar (*)</option>
          <option value="divide">Dividir (/)</option>
        </select>
        
        <input 
          type="number" 
          value={b} 
          onChange={(e) => setB(e.target.value)} 
          placeholder="Número B"
        />
      </div>

      <button onClick={handleCalculate}>Calcular</button>

      {/* RENDERIZADO CONDICIONAL: Mostramos error o resultado dependiendo del estado */}
      {error && <div className="error-message" style={{ color: 'red' }}>Error: {error}</div>}
      {result !== null && <div className="result-message" style={{ color: 'green' }}>Resultado: {result}</div>}
    </div>
  );
}

export default App;
