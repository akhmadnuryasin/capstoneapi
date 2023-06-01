const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(express.json());

// GET semua data history
app.get('/api/history', async (req, res) => {
  try {
    const historyData = await prisma.history.findMany();
    res.json(historyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data history' });
  }
});

// GET data history berdasarkan ID
app.get('/api/history/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const history = await prisma.history.findUnique({
      where: { id: id },
    });

    if (history) {
      res.json(history);
    } else {
      res.status(404).json({ message: 'Data history tidak ditemukan' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data history' });
  }
});

// POST data history baru
app.post('/api/history', async (req, res) => {
  const { event, year } = req.body;

  try {
    const newHistory = await prisma.history.create({
      data: {
        event,
        year,
      },
    });

    res.json(newHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat data history baru' });
  }
});

// DELETE data history berdasarkan ID
app.delete('/api/history/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const deletedHistory = await prisma.history.delete({
      where: { id: id },
    });

    res.json(deletedHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
