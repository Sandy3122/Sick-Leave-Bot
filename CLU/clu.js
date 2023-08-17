const { CLURecognizer } = require('botbuilder-ai');

const intent = CLURecognizer.recognize('Apply Sick Leave', {
  endpoint: 'https://api.CLU.ai/v1/intent/recognize',
  key: 'db96bf032e9c4e1daa5b6c7a72caef00',
});

if (intent) {
  console.log('The intent is: ' + intent.intent);
} else {
  console.log('I don\'t understand.');
}
