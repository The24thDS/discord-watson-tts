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

async function tts(connection, text) {
  const buffer = await synthesizeText(text);
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  connection.play(stream);
}

module.exports = {
  tts,
};
