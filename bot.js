require('dotenv').config()
const Discord = require('discord.js');
const synthesize = require('./synthesizeText');
const Duplex = require('stream').Duplex;

const client = new Discord.Client();

async function tts(connection, text) {
  const buffer = await synthesize(text);
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
	connection.play(stream);
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  const command = msg.content.substr(0,msg.content.indexOf(' ')) || msg.content;
  const content = msg.content.substr(msg.content.indexOf(' ')+1);
  const voiceChannel = msg.member.voice.channel;
  switch (command) {
    case ',join':
      if(voiceChannel) {
        if( client.voice.connections.find(vc => vc.channel.id === voiceChannel.id)) {
          msg.reply('Already in your voice channel.');
        } else {
          await voiceChannel.join()
          msg.channel.send(`Joined voice channel ${voiceChannel}`);
        }
      } else {
        msg.reply('You must be in a voice channel.');
      }
      break;
    case ',say':
      let connection;
      if(voiceChannel) {
        if(! (connection = client.voice.connections.find(vc => vc.channel.id === voiceChannel.id))) {
          connection = await voiceChannel.join();
          msg.channel.send(`Joined voice channel ${voiceChannel}`);
        }
        tts(connection, content);
      } else {
        msg.reply('You must be in a voice channel.');
      }
      break;
    case ',leave':
      if(voiceChannel) {
        let connection;
        if(! (connection = client.voice.connections.find(vc => vc.channel.id === voiceChannel.id))) {
          msg.reply('You must be in a voice channel.');
        } else {
          await connection.channel.leave();
          msg.channel.send(`Left voice channel ${voiceChannel}.`);
        }
      } else {
        msg.reply('You must be in a voice channel.');
      }
    default:
      break;
  }
});

client.login(process.env.TOKEN);