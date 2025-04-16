// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoute from './routes/search.js';

dotenv.config();

const app = express();

// ✅ MUST use Render-provided port
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Route
app.use('/api/search', searchRoute);

// ✅ Basic health check route
app.get('/', (req, res) => {
  res.send('✅ RBP AI Search API is live');
});

// ✅ Correct Render port binding
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

