// index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// "Banco de dados" em memória
let tasks = [];
let nextId = 1;

// Rota simples de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do CRUD de Tarefas está no ar!' });
});

// LISTAR todas as tarefas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// CRIAR uma tarefa
app.post('/tasks', (req, res) => {
  const { titulo, descricao } = req.body;

  if (!titulo || typeof titulo !== 'string') {
    return res.status(400).json({ error: 'Campo "titulo" é obrigatório e deve ser string.' });
  }

  const newTask = {
    id: nextId++,
    titulo: titulo.trim(),
    descricao: (descricao || '').trim(),
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
});

// ATUALIZAR uma tarefa
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { titulo, descricao } = req.body;

  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  if (!titulo || typeof titulo !== 'string') {
    return res.status(400).json({ error: 'Campo "titulo" é obrigatório e deve ser string.' });
  }

  tasks[index] = {
    ...tasks[index],
    titulo: titulo.trim(),
    descricao: (descricao || '').trim(),
  };

  return res.json(tasks[index]);
});

// DELETAR uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  tasks.splice(index, 1);
  return res.status(204).send(); // sem corpo
});

// Subir servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
