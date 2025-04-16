// utils/shopify.js
import axios from 'axios';
import { load } from 'cheerio';

export async function fetchShopifyProduct(keyword) {
  const searchUrl = `https://rbperformancegarage.com/search?q=${encodeURIComponent(keyword)}`;

  try {
    const { data: html } = await axios.get(searchUrl);
    const $ = load(html);

    // Match the first product card link (most reliable)
    const link = $('a.full-unstyled-link').first();

    if (!link.length) return null;

    const title = link.text().trim();
    const relativeUrl = link.attr('href');
    const url = 'https://rbperformancegarage.com' + relativeUrl;

    // Look upward for the nearest image and price
    const container = link.closest('li, div, article');

    const image = container.find('img').attr('src') || container.find('img').attr('data-src');
    const price = container.find('.price, .price__regular, .price-item').first().text().trim().replace(/\s+/g, ' ');

    return {
      title,
      url,
      image: image?.startsWith('http') ? image : 'https:' + image,
      price,
    };
  } catch (err) {
    console.error('Error scraping Shopify:', err.message);
    return null;
  }
}

