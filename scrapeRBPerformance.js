const axios = require('axios');

const URL = 'https://rbperformancegarage.com/products/f80-f82-f87-vrsf-downpipes-2015-2019-bmw-m3-m4-m2-competition';

async function scrapeProductPage(url) {
  try {
    // Extract the product handle from the URL
    const handleMatch = url.match(/\/products\/([^\/\?]+)/);
    if (!handleMatch) {
      throw new Error('Invalid product URL format.');
    }
    const handle = handleMatch[1];

    // Construct the JSON endpoint URL
    const jsonUrl = `https://rbperformancegarage.com/products/${handle}.json`;

    // Fetch the product data
    const response = await axios.get(jsonUrl);
    const product = response.data.product;

    // Extract product details
    const title = product.title;
    const image_url = product.images?.[0]?.src || null;

    // Extract variant information
    const price_options = product.variants.map(variant => ({
      name: variant.title,
      price: `$${(variant.price / 100).toFixed(2)}`
    }));

    const result = {
      title,
      product_url: url,
      image_url,
      price_options
    };

    console.log(JSON.stringify(result, null, 2));
    return result;

  } catch (err) {
    console.error('❌ Error scraping page:', err.message);
    return { error: err.message };
  }
}

scrapeProductPage(URL);
module.exports = scrapeProductPage;
