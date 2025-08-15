import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// 外部サイトや検索結果を代理取得
app.post('/api/fetch', async (req, res) => {
  const { url, query } = req.body;
  try {
    let result;
    if (url) {
      const response = await fetch(url);
      result = await response.text();
    } else if (query) {
      const googleURL = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(googleURL);
      result = await response.text();
    }
    res.json({ success: true, data: result });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy server is running on port ${port}!`));
