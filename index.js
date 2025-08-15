import express from 'express';
import puppeteer from 'puppeteer-core';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// 外部サイトや検索結果を代理取得（Puppeteer-core版）
app.post('/api/fetch', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, error: 'URL 必須' });

  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser', // Render上のChrome
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const content = await page.content();
    res.json({ success: true, data: content });
  } catch (e) {
    res.json({ success: false, error: e.message });
  } finally {
    if (browser) await browser.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy server is running on port ${port}!`));
