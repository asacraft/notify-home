'use strict';

require('dotenv').config();
const googlehome = require('google-home-notifier');
const line = require('@line/bot-sdk');
const express = require('express');

const config = {
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

googlehome.device(process.env.DEVICE_NAME, process.env.LANG);

const app = express();
app.post(process.env.WEBHOOK_PATH, line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    googlehome.notify(event.message.text, res => console.log(res));
  }
}

app.listen(process.env.PORT);

