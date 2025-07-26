const express = require('express');
const axios = require('axios');
const app = express();

// ตั้งค่าจาก Environment Variables
const LINE_TOKEN = process.env.LINE_TOKEN;
const PDF_URL = process.env.PDF_URL;
const PDF_SIZE = parseInt(process.env.PDF_SIZE || '1048576'); // default 1MB

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text.trim();

      if (text === '1') {
        // ตอบกลับเป็นไฟล์ PDF
        await axios.post(
          'https://api.line.me/v2/bot/message/reply',
          {
            replyToken: event.replyToken,
            messages: [
              {
                type: 'file',
                fileName: 'รายงาน.pdf',
                fileSize: PDF_SIZE,
                fileUrl: PDF_URL
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${LINE_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // ตอบกลับข้อความทั่วไป
        await axios.post(
          'https://api.line.me/v2/bot/message/reply',
          {
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: 'พิมพ์ "A" เพื่อรับไฟล์ PDF รายงานครับ'
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${LINE_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));
