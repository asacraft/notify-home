'use strict';

require('dotenv').config();
const googlehome = require('google-home-notifier');
const bbt = require('beebotte');
const channel = process.env.BEEBOTTE_CHANNEL_NAME;
const transport = {
  type: 'mqtt',
  token: process.env.BEEBOTTE_CHANNEL_TOKEN
};
const names = {
  dad: 'お父さん',
  mon: 'お母さん'
};

googlehome.device(process.env.DEVICE_NAME, process.env.LANG);

const client = new bbt.Stream({ transport: transport });
client.on('connected', function () {
  client.subscribe(channel, 'dad', handleEvent('dad'));
  client.subscribe(channel, 'mom', handleEvent('mon'));
  client.subscribe(channel, 'repeatdad', handleRepeat('dad'));
  client.subscribe(channel, 'repeatmom', handleRepeat('mom'));
});

function handleEvent(resource) {
  return function (message) {
    notify(resource, message.data);
  };
}

function notify(resource, message) {
  googlehome.notify(names[resource] + 'から、' + message, res => console.log(res));
}

const reader = new bbt.Connector({ token: process.env.BEEBOTTE_CHANNEL_TOKEN });

function handleRepeat(resource) {
  return function(message) {
    reader.read(
      { channel: channel, resource: resource, limit: 1 },
      function (err, res) {
        if (err) throw(err);
	if (res.length > 0) {
	  notify(resource, res[0].data);
	}
	console.log(res);
      }
    );
  }
}

