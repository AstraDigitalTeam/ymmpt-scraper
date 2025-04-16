// utils/openai.js
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transforms a user query into a condensed keyword string for Shopify search.
 * @param {string} query - User natural language query
 * @returns {Promise<string>} - Condensed keyword string
 */
export async function generateSearchKeyword(query) {
  const prompt = `You are helping an automotive parts website. Extract a short, relevant keyword phrase (make, model, year, part) from the user query: "${query}". Only return the search phrase.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 30,
  });

  return response.choices[0].message.content.trim();
}

