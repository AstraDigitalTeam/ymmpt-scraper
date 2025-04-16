// routes/search.js
import express from 'express';
import { generateSearchKeyword } from '../utils/openai.js';
import { fetchShopifyProduct } from '../utils/shopify.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Missing query in request body.' });
  }

  try {
    const keyword = await generateSearchKeyword(query);
    console.log('🧠 GPT Keyword:', keyword);

    const product = await fetchShopifyProduct(keyword);

    if (!product) {
      return res.status(404).json({ message: 'No product found for that query.' });
    }

    res.json({ keyword, product });
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;

