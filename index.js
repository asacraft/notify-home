'use strict';

require('dotenv').config();
const googlehome = require('google-home-notifier');
const bbt = require('beebotte');
const channel = process.env.BEEBOTTE_CHANNEL_NAME;
const transport = {
  type: 'mqtt',
  token: process.env.BEEBOTTE_CHANNEL_TOKEN
};

googlehome.device(process.env.DEVICE_NAME, process.env.LANG);

const client = new bbt.Stream({ transport: transport });
client.on('connected', function () {
  client.subscribe(channel, 'dad', handleEvent('お父さん'));
  client.subscribe(channel, 'mom', handleEvent('お母さん'));
});

function handleEvent(resource) {
  return function (message) {
    googlehome.notify(resource + 'から、' + message.data, res => console.log(res));
  };
}

