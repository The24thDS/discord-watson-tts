require('dotenv').config();
const Discord = require('discord.js');
const { join, leave, say } = require('./commands');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  const command =
    msg.content.substr(0, msg.content.indexOf(' ')) || msg.content;
  const content = msg.content.substr(msg.content.indexOf(' ') + 1);
  const voiceChannel = msg.member.voice.channel;
  switch (command) {
    case ',join':
      join(voiceChannel, msg, client);
      break;
    case ',say':
      say(voiceChannel, msg, client, content);
      break;
    case ',leave':
      leave(voiceChannel, msg, client);
    default:
      break;
  }
});

client.login(process.env.TOKEN);
