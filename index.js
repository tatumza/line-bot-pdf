const express = require('express');
const axios = require('axios');
const app = express();

const LINE_TOKEN = process.env.LINE_TOKEN;

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text.trim();

      if (text === '1') {
        // ✅ ตอบกลับด้วย Flex Message
        const flexMessage = {
          type: 'flex',
          altText: '📄 ดาวน์โหลดรายงาน PDF',
          contents: {
            type: 'bubble',
            hero: {
              type: 'image',
              url: 'https://www.nufthailand.com/img/pdflogo.png',
              size: 'full',
              aspectRatio: '1.51:1',
              aspectMode: 'cover'
            },
            body: {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              contents: [
                {
                  type: 'text',
                  text: 'เอกสารประกอบการบรรยาย',
                  weight: 'bold',
                  size: 'xl'
                },
                {
                  type: 'text',
                  text: 'กดปุ่มด้านล่างเพื่อดาวน์โหลดไฟล์ PDF',
                  wrap: true,
                  size: 'sm',
                  color: '#888888'
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#00B900',
                  action: {
                    type: 'uri',
                    label: '📥 ดาวน์โหลด PDF',
                    uri: 'https://www.nufthailand.com/pdf/NuFPresentation_V2.pdf'
                  }
                }
              ]
            }
          }
        };

        // ส่ง Flex Message
        await axios.post(
          'https://api.line.me/v2/bot/message/reply',
          {
            replyToken: event.replyToken,
            messages: [flexMessage]
          },
          {
            headers: {
              Authorization: `Bearer ${LINE_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // ตอบทั่วไป
        await axios.post(
          'https://api.line.me/v2/bot/message/reply',
          {
            replyToken: event.replyToken,
            messages: [
              {
                type: 'text',
                text: 'พิมพ์ "1" เพื่อรับรายงาน PDF'
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
app.listen(PORT, () => console.log(`✅ LINE Bot running on port ${PORT}`));
