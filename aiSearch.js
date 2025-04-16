require('dotenv').config();
const axios = require('axios');
const { OpenAI } = require('openai');
const scrapeProductPage = require('./scrapeRBPerformance');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function searchRBPerformance(searchTerm) {
  try {
    const query = encodeURIComponent(searchTerm);
    const searchUrl = `https://rbperformancegarage.com/search?q=${query}`;

    const { data: html } = await axios.get(searchUrl);
    const match = html.match(/"url":"(\/products\/[^"]+)"/);

    if (match && match[1]) {
      const relativeUrl = match[1].replace(/\\u002D/g, '-');
      const productUrl = `https://rbperformancegarage.com${relativeUrl}`;
      return productUrl;
    } else {
      return null;
    }
  } catch (err) {
    console.error('❌ Error during search:', err.message);
    return null;
  }
}

require('dotenv').config();
const axios = require('axios');
const { OpenAI } = require('openai');
const scrapeProductPage = require('./scrapeRBPerformance');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function searchRBPerformance(searchTerm) {
  try {
    const query = encodeURIComponent(searchTerm);
    const searchUrl = `https://rbperformancegarage.com/search?q=${query}`;

    const { data: html } = await axios.get(searchUrl);
    const match = html.match(/"url":"(\/products\/[^"]+)"/);

    if (match && match[1]) {
      const relativeUrl = match[1].replace(/\\u002D/g, '-');
      const productUrl = `https://rbperformancegarage.com${relativeUrl}`;
      return productUrl;
    } else {
      return null;
    }
  } catch (err) {
    console.error('❌ Error during site search:', err.message);
    return null;
  }
}

async function aiSearch(userQuery) {
  try {
    const prompt = `
A customer is searching for a product on an automotive website. Based on their input, return the best short search term to use on the site.

Query: "${userQuery}"
Only return the keyword. No explanation.
    `.trim();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 20,
    });

    const searchTerm = response.choices[0].message.content.replace(/["']/g, '').trim();
    console.log(`🔍 Generated Search Term: "${searchTerm}"`);

    const productUrl = await searchRBPerformance(searchTerm);

    if (!productUrl) {
      console.warn('⚠️ No products found for the search term.');
      return null;
    }

    const productData = await scrapeProductPage(productUrl);
    return productData;

  } catch (err) {
    console.error('❌ AI search error:', err.message);
    return null;
  }
}

module.exports = aiSearch;

