require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { webhook: true });

bot.setWebhook(`https://${process.env.VERCEL_URL}/bot`);

app.post('/bot', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Handle /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Enter a Google Drive file link:');
});

// Handle incoming messages
bot.on('message', (msg) => {
  if (msg.text) {
    const link = msg.text;
    const fileId = extractFileId(link);
    if (fileId) {
      const downloadLink = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=AIzaSyB2Gi6A21kfBvBDs3MRfF5yKrp-nxmRbLQ`;
      bot.sendMessage(msg.chat.id, downloadLink, { caption: 'Direct Download Link', });
    } else {
      bot.sendMessage(msg.chat.id, 'Invalid Google Drive file link format.');
    }
  }
})
