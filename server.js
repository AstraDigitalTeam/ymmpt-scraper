// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoute from './routes/search.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/api/search', searchRoute);

app.get('/', (req, res) => {
  res.send('RBP Search Tool API is running...');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

