import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
// import { ITelegramMessage } from '../types/Telegram';
import logger from '../util/Logger';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { FileModel } from '../models/FileModel';

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
});

bot.onText(/\/start/, (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome! ${msg.from?.first_name}, you can generate image links for files upto 10 Mb for 1 hour free`,
  );
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

      const fPath = `${file.file_path}`?.split('/');
      const fName = fPath[fPath.length - 1];

      const fFormat = `${fName}`.split('.');
      const fExt = fFormat[fFormat.length - 1];

      const fileMetaData = {
        file_name: fName,
        file_size: file?.file_size,
        file_owner: msg.from?.username,
        file_format: fExt,
        file_upload_origin: 'Telegram',
        telegram_file_id: fileId,
        expiresAt: Date.now() + 60 * 60 * 1000,
      };

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

      // save file info
      const saveFile = await FileModel.create(fileMetaData);
      const savedFileId = saveFile?.id;

      writer.on('finish', () => {
        bot.sendMessage(
          chatId,
          'File saved succesfully. Use the link to view the file',
        );
        bot.sendMessage(
          chatId,
          `https://cdn.jacobwatenga.com/t/${savedFileId}`,
        );
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

bot.on('audio', (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🫠 Oops! Images only for now!');
  bot.deleteMessage(chatId, msg.message_id);
});

bot.on('video', (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🫠 Oops! Images only for now!');
  bot.deleteMessage(chatId, msg.message_id);
});

bot.on('document', (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '🫠 Oops! Images only for now!');
  bot.deleteMessage(chatId, msg.message_id);
});

// bot.onText(/\/upload/, (msg: TelegramBot.Message) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, `Select a file to upload!`);
// });

// bot.onText(/\/delete/, (msg: TelegramBot.Message) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, `Input the file ID to delete!`);
//   console.log(msg.text);
// });

// bot.onText(/\/list/, (msg: TelegramBot.Message) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, `Listing all files!`);
// });

bot.on('polling_error', (error) => {
  logger.info(`Telegram error : ${error.name}`);
});
