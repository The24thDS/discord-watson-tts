const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.API_KEY,
  }),
  serviceUrl: process.env.URL,
  disableSslVerification: true,
});


const synthesizeText = async (text) => {
  const synthesizeParams = {
    text,
    accept: 'audio/wav',
    voice: 'en-GB_JamesV3Voice',
  };

  const response = await textToSpeech.synthesize(synthesizeParams);
  const buffer = textToSpeech.repairWavHeaderStream(response.result);
  return buffer;
}

module.exports = synthesizeText;