const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Mock data for articles
let articles = [
  { id: 1, title: 'First Article', content: 'This is the first article.' },
  { id: 2, title: 'Second Article', content: 'This is the second article.' }
];


// Get all articles
app.get('/articles', (req, res) => {
  res.json(articles);
});

// Get a specific article
app.get('/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const article = articles.find(article => article.id === id);
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
  } else {
    res.json(article);
  }
});

// Create a new article
app.post('/articles', (req, res) => {
  const { title, content } = req.body;
  const id = articles.length + 1;
  const newArticle = { id, title, content };
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

// Update an existing article
app.put('/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const article = articles.find(article => article.id === id);
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
  } else {
    article.title = title;
    article.content = content;
    res.json(article);
  }
});

// Delete an article
app.delete('/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  articles = articles.filter(article => article.id !== id);
  res.sendStatus(204);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});