const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'designs.json');

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Higher limit for base64 images

// Helper to read data
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

// Helper to write data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Get all saved designs
app.get('/api/designs', (req, res) => {
  try {
    const designs = readData();
    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load designs' });
  }
});

// Save a new design
app.post('/api/designs', (req, res) => {
  try {
    const designs = readData();
    const newDesign = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...req.body
    };
    designs.push(newDesign);
    writeData(designs);
    res.status(201).json(newDesign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save design' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
