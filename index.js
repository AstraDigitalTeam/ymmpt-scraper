const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

app.get("/search", async (req, res) => {
  const { year, make, model, partType } = req.query;

  if (!year || !make || !model || !partType) {
    return res.status(400).json({ error: "Missing one or more query parameters" });
  }

  const searchUrl = `https://rbperformancegarage.com/search?q=${year}+${make}+${model}+${partType}`;

  try {
    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);

    const results = [];

    $(".productgrid--item").each((i, el) => {
      const title = $(el).find(".productitem--title").text().trim();
      const link = $(el).find("a").attr("href");
      const price = $(el).find(".price--main").text().trim();

      results.push({
        title,
        link: `https://rbperformancegarage.com${link}`,
        price,
      });
    });

    res.json({ results });
  } catch (err) {
    console.error("Scraping failed:", err.message);
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
