const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configure SQLite
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`
    CREATE TABLE contracts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cnpj TEXT,
      startDate TEXT,
      endDate TEXT,
      supplier TEXT,
      object TEXT,
      initialValue REAL
    )
  `);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para buscar contratos
app.post('/getContracts', async (req, res) => {
  const { cnpj, startDate, endDate } = req.body;

  try {
    // Consome a API do PNCP
    const response = await axios.get('https://pncp.gov.br/api/consulta/contratos', {
      params: {
        cnpj,
        dataInicio: startDate,
        dataFim: endDate,
      }
    });

    const contracts = response.data;

    // Insere contratos no banco de dados
    const stmt = db.prepare(`
      INSERT INTO contracts (cnpj, startDate, endDate, supplier, object, initialValue)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    let totalValue = 0;
    contracts.forEach(contract => {
      stmt.run(
        cnpj,
        contract.dataVigenciaInicial,
        contract.dataVigenciaFinal,
        contract.razaoSocialFornecedor,
        contract.objetoContrato,
        contract.valorInicial
      );
      totalValue += contract.valorInicial;
    });

    stmt.finalize();

    // Envia resposta
    res.json({
      contracts,
      totalValue
    });
  } catch (error) {
    res.status(500).send('Erro ao buscar contratos.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

