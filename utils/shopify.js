// utils/shopify.js
import axios from 'axios';
import { load } from 'cheerio';

export async function fetchShopifyProduct(keyword) {
  const searchUrl = `https://rbperformancegarage.com/search?q=${encodeURIComponent(keyword)}`;

  try {
    const { data: html } = await axios.get(searchUrl);
    const $ = load(html);

    const productCard = $('.product-card').first();
    if (!productCard.length) return null;

    const link = productCard.find('a.full-unstyled-link').attr('href');
    const title = productCard.find('a.full-unstyled-link').text().trim();
    const image = productCard.find('img.card__image').attr('src') || productCard.find('img.card__image').attr('data-src');
    const price = productCard.find('.price-item').first().text().trim().replace(/\s+/g, ' ');

    return {
      title,
      url: 'https://rbperformancegarage.com' + link,
      image: image?.startsWith('http') ? image : 'https:' + image,
      price,
    };
  } catch (err) {
    console.error('❌ Error scraping Shopify:', err.message);
    return null;
  }
}

