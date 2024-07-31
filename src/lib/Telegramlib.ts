import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { ITelegramMessage } from '../types/Telegram';
import logger from '../util/Logger';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

dotenv.config({
  path: './.env',
});

const botToken = process.env.TELEGRAM_BOT_HTTP_API;
const fileStoragePath = './public/storage';

const bot = new TelegramBot(`${botToken}`, {
  polling: true,
  filepath: false,
});

// messages.
bot.on('message', (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;

  if (msg.text?.toLowerCase() === 'hi') {
    bot.sendMessage(chatId, `Hi too, ${msg.from?.first_name}`);
  }

  // send a message to the chat acknowledging receipt of their message
  //   bot.sendMessage(chatId, 'Message received');
});

bot.onText(/\/start/, (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Welcome! ${msg.from?.first_name}`);
  bot.sendMessage(chatId, 'Welcome', {
    reply_markup: {
      keyboard: [
        [{ text: 'Button 1' }, { text: 'Button 2' }],
        [{ text: 'Row 2 Button 1' }],
      ],
    },
  });
});

bot.on('photo', async (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  const photoArray = msg?.photo;

  if (photoArray) {
    const photo = photoArray[photoArray?.length - 1];
    const fileId = photo.file_id;

    try {
      const file = await bot.getFile(fileId);
      const filePath = file?.file_path;

      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_HTTP_API}/${filePath}`;
      const localFilePath = path.join(
        fileStoragePath,
        path.basename(`${filePath}`),
      );

      // Download file
      const rsp = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(localFilePath);
      rsp.data.pipe(writer);

      writer.on('finish', () => {
        bot.sendMessage(chatId, 'Image saved successfully!');
      });

      writer.on('error', (err) => {
        console.error('File download failed:', err);
        bot.sendMessage(chatId, 'Failed to save the image.');
      });
    } catch (err) {
      logger.info(err);
      bot.sendMessage(chatId, 'Error processing image!');
    }
  }
});

bot.onText(/\/upload/, (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Select a file to upload!`);
});

bot.onText(/\/delete/, (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Input the file ID to delete!`);
  console.log(msg.text);
});

bot.onText(/\/list/, (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Listing all files!`);
});

bot.on('polling_error', (error) => {
  logger.info(`Telegram error : ${error.name}`);
});
