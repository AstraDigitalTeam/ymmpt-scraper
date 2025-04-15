const scrapeProductPage = require('./scrapeRBPerformance');

scrapeProductPage('https://rbperformancegarage.com/products/f80-f82-f87-vrsf-downpipes-2015-2019-bmw-m3-m4-m2-competition')
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));

