const { BotBuilder, LuisRecognizer } = require('botbuilder-dialogs');
const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

const luisAppId = 'your-luis-app-id';
const luisSubscriptionKey = 'your-luis-subscription-key';

const makeSickLeaveDialog = new DialogSet('makeSickLeaveDialog');

const firstStep = async (step) => {
    const recognizer = new LuisRecognizer(luisAppId, luisSubscriptionKey);
    const intent = await recognizer.recognize(step.context);
    if (intent === 'ApplySickLeave') {
        return await step.next('getName');
    } else {
        return await step.endDialog();
    }
};

const getName = async (step) => {
    const name = await step.prompt('What is your name?');
    if (name) {
        return await step.next('getStartDate');
    } else {
        return await step.retry();
    }
};

const getStartDate = async (step) => {
    const startDate = await step.prompt('When would you like to start your sick leave?');
    if (startDate) {
        return await step.next('getEndDate');
    } else {
        return await step.retry();
    }
};

const getEndDate = async (step) => {
    const endDate = await step.prompt('When would you like to end your sick leave?');
    if (endDate) {
        return await step.next('getReason');
    } else {
        return await step.retry();
    }
};

const getReason = async (step) => {
    const reason = await step.prompt('Please enter the reason for your sick leave.');
    if (reason) {
        // Send the sick leave request to the back-end
        return await step.endDialog();
    } else {
        return await step.retry();
    }
};

makeSickLeaveDialog.addDialog(firstStep);
makeSickLeaveDialog.addDialog(getName);
makeSickLeaveDialog.addDialog(getStartDate);
makeSickLeaveDialog.addDialog(getEndDate);
makeSickLeaveDialog.addDialog(getReason);

const bot = new BotBuilder();
bot.dialogs(makeSickLeaveDialog);
bot.startConversation();