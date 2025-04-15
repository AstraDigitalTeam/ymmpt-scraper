const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const aiSearch = require('./aiSearch');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Health check route
app.get('/', (req, res) => {
  res.send('✅ YMMPT AI Search API is running!');
});

// AI search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing search query' });
    }

    const result = await aiSearch(query);
    if (!result) {
      return res.status(404).json({ message: 'No matching product found.' });
    }

    res.json(result);
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server on 0.0.0.0 so Render can connect to it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


