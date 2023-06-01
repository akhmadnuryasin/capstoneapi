const express = require('express');
const prisma = new PrismaClient();
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key'; // Replace with your own secret key
const refreshTokens = [];
const users = [];

// Middleware
app.use(bodyParser.json());

// Registration API
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  const user = {
    username,
    password
  };
  users.push(user);

  res.status(201).json({ message: 'Registration successful' });
});

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  const user = users.find(u => u.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);

  res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
});

// Access Token Generation
function generateAccessToken(user) {
  return jwt.sign({ username: user.username }, secretKey, { expiresIn: '15m' });
}

// Refresh Token Generation
function generateRefreshToken(user) {
  return jwt.sign({ username: user.username }, secretKey);
}

// Token Refresh API
app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken({ username: decoded.username });
    res.status(200).json({ accessToken });
  });
});

// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed successfully' });
});

// Token Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid access token' });
    }

    req.user = decoded.username;
    next();
  });
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});