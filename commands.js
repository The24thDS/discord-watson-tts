const { tts } = require('./utils');

const join = async (voiceChannel, msg, client) => {
  if (voiceChannel) {
    if (
      client.voice.connections.find((vc) => vc.channel.id === voiceChannel.id)
    ) {
      msg.reply('Already in your voice channel.');
    } else {
      await voiceChannel.join();
      msg.channel.send(`Joined voice channel ${voiceChannel}`);
    }
  } else {
    msg.reply('You must be in a voice channel.');
  }
};

const leave = async (voiceChannel, msg, client) => {
  if (voiceChannel) {
    let connection;
    if (
      !(connection = client.voice.connections.find(
        (vc) => vc.channel.id === voiceChannel.id
      ))
    ) {
      msg.reply('You must be in a voice channel.');
    } else {
      await connection.channel.leave();
      msg.channel.send(`Left voice channel ${voiceChannel}.`);
    }
  } else {
    msg.reply('You must be in a voice channel.');
  }
};

const say = async (voiceChannel, msg, client, content) => {
  let connection;
  if (voiceChannel) {
    if (
      !(connection = client.voice.connections.find(
        (vc) => vc.channel.id === voiceChannel.id
      ))
    ) {
      connection = await voiceChannel.join();
      msg.channel.send(`Joined voice channel ${voiceChannel}`);
    }
    tts(connection, content);
  } else {
    msg.reply('You must be in a voice channel.');
  }
};

module.exports = {
  join,
  leave,
  say,
};
