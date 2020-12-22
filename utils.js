const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const Duplex = require('stream').Duplex;

const synthesizeText = async (text) => {
  const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
      apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.URL,
    disableSslVerification: true,
  });
  const synthesizeParams = {
    text,
    accept: 'audio/wav',
    voice: 'en-GB_JamesV3Voice',
  };

  const response = await textToSpeech.synthesize(synthesizeParams);
  const buffer = textToSpeech.repairWavHeaderStream(response.result);
  return buffer;
};

const tts = async (connection, text) => {
  const buffer = await synthesizeText(text);
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  connection.play(stream);
};

const listCommands = async (client, onlyNames = false) => {
  let commands = await client.api.applications(client.user.id).commands.get();

  if (onlyNames) {
    commands = commands.map((command) => command.name);
  }

  return commands;
};

const registerGlobalCommand = async (client, commandData) =>
  await client.api.applications(client.user.id).commands.post({
    data: commandData,
  });

const checkCommamds = async (client) => {
  const globalCommandsData = require('./global-commands-data.json');
  const registeredCommands = await listCommands(client, true);

  if (globalCommandsData.length > registeredCommands.length) {
    const nonregisteredCommands = globalCommandsData.filter(
      ({ name }) => !registeredCommands.includes(name)
    );
    console.log('Registering new commands');
    nonregisteredCommands.forEach(async (commandData) => {
      const response = await registerGlobalCommand(client, commandData);
      if (response.id) {
        console.log(`Registered global command ${commandData.name}`);
      }
    });
  } else {
    console.log('No new commands to register.');
  }
};

const replyToInteraction = (
  client,
  interactionId,
  interactionToken,
  message
) => {
  client.api.interactions(interactionId, interactionToken).callback.post({
    data: {
      type: 4,
      data: {
        content: message,
      },
    },
  });
};

const acknowledgeInteraction = (client, interactionId, interactionToken) => {
  client.api.interactions(interactionId, interactionToken).callback.post({
    data: {
      type: 5,
    },
  });
};

module.exports = {
  tts,
  listCommands,
  registerGlobalCommand,
  checkCommamds,
  replyToInteraction,
  acknowledgeInteraction,
};
