import React from 'react';

function Resultados({ data }) {
  if (data.error) {
    return (
      <div>
        <strong>Error:</strong> {data.error}
      </div>
    );
  }

  const {
    tipo,
    subnetMask,
    subnetMaskDecimal,
    totalSubnets,
    hostsPerSubnet,
    subnetIncrement,
    subnets,
    showAllSubnets,
  } = data;

  return (
    <div>
      <h2>Resultados del Cálculo</h2>
      <p>
        <strong>Tipo de IP:</strong> {tipo}
      </p>
      <p>
        <strong>Máscara de Subred:</strong> /{subnetMask} ({subnetMaskDecimal})
      </p>
      <p>
        <strong>Salto entre Subredes:</strong> {subnetIncrement} direcciones
      </p>
      <p>
        <strong>Total de Subredes:</strong> {totalSubnets}
      </p>
      <p>
        <strong>Hosts por Subred:</strong> {hostsPerSubnet}
      </p>
      <h3>Ejemplos de Subredes:</h3>
      {showAllSubnets ? (
        subnets.map((subnet, index) => (
          <div key={index}>
            <p>
              <strong>Subred {subnet.index}:</strong>
            </p>
            <p>
              <strong>Red:</strong> {subnet.red}
            </p>
            <p>
              <strong>Rango de Hosts:</strong> {subnet.rango}
            </p>
            <p>
              <strong>Broadcast:</strong> {subnet.broadcast}
            </p>
          </div>
        ))
      ) : (
        <>
          {subnets.firstSubnets.map((subnet, index) => (
            <div key={index}>
              <p>
                <strong>Subred {subnet.index}:</strong>
              </p>
              <p>
                <strong>Red:</strong> {subnet.red}
              </p>
              <p>
                <strong>Rango de Hosts:</strong> {subnet.rango}
              </p>
              <p>
                <strong>Broadcast:</strong> {subnet.broadcast}
              </p>
            </div>
          ))}
          <p>...</p>
          {subnets.lastSubnets.map((subnet, index) => (
            <div key={index}>
              <p>
                <strong>Subred {subnet.index}:</strong>
              </p>
              <p>
                <strong>Red:</strong> {subnet.red}
              </p>
              <p>
                <strong>Rango de Hosts:</strong> {subnet.rango}
              </p>
              <p>
                <strong>Broadcast:</strong> {subnet.broadcast}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Resultados;
