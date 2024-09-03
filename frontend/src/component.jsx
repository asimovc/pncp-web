// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function Component() {
  const [cnpj, setCnpj] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contracts, setContracts] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  const fetchContracts = async () => {
    try {
      const response = await axios.post('http://localhost:3000/getContracts', {
        cnpj,
        startDate,
        endDate
      });

      setContracts(response.data.contracts);
      setTotalValue(response.data.totalValue);
    } catch (error) {
      console.error('Erro ao buscar contratos', error);
    }
  };

  return (
    <div>
      <h1>Visualizador de Contratos</h1>
      <input
        type="text"
        placeholder="CNPJ"
        value={cnpj}
        onChange={(e) => setCnpj(e.target.value)}
      />
      <input
        type="date"
        placeholder="Data Inicial"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        placeholder="Data Final"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={fetchContracts}>Buscar Contratos</button>

      <div>
        <h2>Contratos</h2>
        <table>
          <thead>
            <tr>
              <th>Data Início</th>
              <th>Data Fim</th>
              <th>Fornecedor</th>
              <th>Objeto</th>
              <th>Valor Inicial</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => (
              <tr key={index}>
                <td>{contract.dataVigenciaInicial}</td>
                <td>{contract.dataVigenciaFinal}</td>
                <td>{contract.razaoSocialFornecedor}</td>
                <td>{contract.objetoContrato}</td>
                <td>{contract.valorInicial.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Valor Total: R$ {totalValue.toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default Component;

