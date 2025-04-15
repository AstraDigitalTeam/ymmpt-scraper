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
      const relativeUrl = match[1].replace(/\\u002D/g, '-'); // fix dashes
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

async function aiSearch(userQuery) {
  try {
    const prompt = `
A customer is looking for a performance automotive product from RB Performance Garage's website. Based on their query, return the best short search keyword to use in the site search bar.

Query: "${userQuery}"
Only return the keyword. No explanation.
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 20,
    });

    const rawSearchTerm = response.choices[0].message.content.replace(/"/g, '').trim();
    console.log(`🔍 Generated Search Term: "${rawSearchTerm}"`);

    const productUrl = await searchRBPerformance(rawSearchTerm);

    if (!productUrl) {
      console.warn("⚠️ No products found for the search term.");
      console.error("❌ No result returned.");
      return;
    }

    const productData = await scrapeProductPage(productUrl);

    if (!productData) {
      console.error("❌ No result returned.");
    } else {
      console.log(JSON.stringify(productData, null, 2));
    }
  } catch (err) {
    console.error('❌ AI search error:', err.message);
  }
}

module.exports = aiSearch;

