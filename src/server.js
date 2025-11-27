// src/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // libera acesso para o app React Native
app.use(express.json()); // permite receber JSON no body

// "Banco de dados" em memória (perde tudo se reiniciar o servidor)
let tasks = [];
let nextId = 1;

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API de Tarefas está rodando 🚀' });
});

// LISTAR todas as tarefas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// BUSCAR uma tarefa por ID (opcional, mas é legal ter)
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  res.json(task);
});

// CRIAR nova tarefa
app.post('/tasks', (req, res) => {
  const { titulo, descricao } = req.body;

  if (!titulo || typeof titulo !== 'string') {
    return res.status(400).json({ error: 'Título é obrigatório e deve ser texto.' });
  }

  const newTask = {
    id: nextId++,
    titulo,
    descricao: descricao || '',
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ATUALIZAR tarefa
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { titulo, descricao } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  if (!titulo || typeof titulo !== 'string') {
    return res.status(400).json({ error: 'Título é obrigatório e deve ser texto.' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    titulo,
    descricao: descricao || '',
  };

  res.json(tasks[taskIndex]);
});

// DELETAR tarefa
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  const deleted = tasks.splice(taskIndex, 1)[0];
  res.json({ message: 'Tarefa removida com sucesso', task: deleted });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
