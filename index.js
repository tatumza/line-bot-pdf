const express = require('express');
const axios = require('axios');
const app = express();

// ตั้งค่าจาก Environment Variables
const LINE_TOKEN = process.env.LINE_TOKEN;
const PDF_URL = process.env.PDF_URL || "https://raw.githubusercontent.com/tatumza/line-bot-pdf/main/final%20%20TRL%20%20.pdf";
const PDF_SIZE = parseInt(process.env.PDF_SIZE || '631070'); // ขนาดจริงของไฟล์ PDF

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text.trim();

      if (text === '1A') {
        // ตอบกลับเป็นไฟล์ PDF
        try {
          await axios.post(
            'https://api.line.me/v2/bot/message/reply',
            {
              replyToken: event.replyToken,
              messages: [
                {
                  type: 'file',
                  fileName: 'final_TRL.pdf',
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
        } catch (error) {
          console.error('❌ Error sending PDF:', error.response?.data || error.message);
        }
      } else {
        // ตอบกลับข้อความทั่วไป
        try {
          await axios.post(
            'https://api.line.me/v2/bot/message/reply',
            {
              replyToken: event.replyToken,
              messages: [
                {
                  type: 'text',
                  text: 'พิมพ์ "1" เพื่อรับไฟล์ PDF: final_TRL.pdf'
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
        } catch (error) {
          console.error('❌ Error sending text reply:', error.response?.data || error.message);
        }
      }
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ LINE Bot running on port ${PORT}`));
