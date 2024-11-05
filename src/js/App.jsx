import React, { useState } from 'react';
import InputIP from './components/InputIP';
import InputMask from './components/InputMask';
import Resultados from './components/Resultados';
import calcularSubred from './utils/calculos';

function App() {
  const [ip, setIp] = useState('');
  const [mask, setMask] = useState(24);
  const [subnetMask, setSubnetMask] = useState(26);
  const [resultados, setResultados] = useState(null);

  const handleCalcular = () => {
    const resultadosCalculados = calcularSubred(ip, mask, subnetMask);
    setResultados(resultadosCalculados);
  };

  return (
    <div>
      <h1>Calculadora de Subredes</h1>
      <InputIP value={ip} onChange={setIp} />
      <InputMask label="Máscara de Red" value={mask} onChange={setMask} />
      <InputMask
        label="Máscara de Subred"
        value={subnetMask}
        onChange={setSubnetMask}
      />
      <button onClick={handleCalcular}>Calcular</button>
      {resultados && <Resultados data={resultados} />}
    </div>
  );
}

export default App;
