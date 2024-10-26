 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',       
  user: 'root',     
  password: 'Beatriz123/',  
  database: 'bellpharma'    
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL!');
});

app.get('/api/medicamentos', (req, res) => {
  db.query('SELECT * FROM medicamentos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.get('/api/medicamentos/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM medicamentos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Medicamento não encontrado.');
    res.json(results[0]);
  });
});

app.post('/api/medicamentos', (req, res) => {
  const { nome, laboratorio, forma_farmaceutica, descricao, quantidade, data_val, data_lan } = req.body;
  db.query('INSERT INTO medicamentos (nome, laboratorio, forma_farmaceutica, descricao, quantidade, data_val, data_lan) VALUES (?, ?, ?, ?, ?, ?, ?)', 
  [nome, laboratorio, forma_farmaceutica, descricao, quantidade, data_val, data_lan], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

app.put('/api/medicamentos/:id', (req, res) => {
  const id = req.params.id;
  const { nome, laboratorio, forma_farmaceutica, descricao, quantidade, data_val, data_lan } = req.body;
  db.query('UPDATE medicamentos SET nome = ?, laboratorio = ?, forma_farmaceutica = ?, descricao = ?, quantidade = ?, data_val = ?, data_lan = ? WHERE id = ?', 
  [nome, laboratorio, forma_farmaceutica, descricao, quantidade, data_val, data_lan, id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.affectedRows === 0) return res.status(404).send('Medicamento não encontrado.');
    res.json({ id, ...req.body });
  });
});

app.delete('/api/medicamentos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM medicamentos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.affectedRows === 0) return res.status(404).send('Medicamento não encontrado.');
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:3000`);
});
