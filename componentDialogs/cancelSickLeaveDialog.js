const {WaterfallDialog, ComponentDialog, DialogSet, DialogTurnStatus} = require('botbuilder-dialogs');

const {ConfirmPrompt,ChoicePrompt, DateTimePrompt, TextPrompt} = require('botbuilder-dialogs');

const {CardFactory} = require('botbuilder');

const {Adaptive_card} = require('../resources/adaptiveCards/CancelSickLeaveCard');

// const CARDS = [cancelCard];

const Confirm_Prompt = "Confirm_Prompt";
const Choice_Prompt = "Choice_Prompt";
const Text_Prompt = "Text_Prompt";
const DateTime_Prompt = "DateTime_Prompt";
const Waterfall_Dialog = "Waterfall_Dialog";
let endDialog = '';

class CancelSickLeaveDialog extends ComponentDialog{

    constructor(conversationState, userState){
        super('cancelSickLeaveDialog');

        this.addDialog(new TextPrompt(Text_Prompt));
        this.addDialog( new DateTimePrompt(DateTime_Prompt));
        this.addDialog(new ConfirmPrompt(Confirm_Prompt));
        this.addDialog(new ChoicePrompt(Choice_Prompt));
        
        //WaterFall Dialog
        this.addDialog(new WaterfallDialog(Waterfall_Dialog, [

            this.firstStep.bind(this),          // Ask confirmatiopn if user want to make reservation
            this.ConfirmStep.bind(this),        // Show summary of values entered by user and ask confirmation to make sick leave
            this.summaryStep.bind(this)         // Final step to process the sick leave application
        ]));
            this.initialDialogId = Waterfall_Dialog;
            // this.endDialog = false; // Change endDialog to a class property
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
    
        // Check if the 'results' object is defined before accessing its properties
        if (dialogContext.activeDialog && !dialogContext.activeDialog.state) {
            await dialogContext.beginDialog(this.id);
        } else {
            const results = await dialogContext.continueDialog();
            if (results.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog(this.id);
            }
        }
    }

async firstStep(step) {
endDialog = false;
//Running a prompt here means the next WaterFallStep will be run when the users response is received
//Adaptive Cards has sent as an attachments

// const adaptiveCard = CardFactory.adaptiveCard(Adaptive_card());
// await step.context.sendActivity({ attachments: [adaptiveCard] });

return await step.prompt(Text_Prompt, 'Please enter the HRM_ID to cancel the sick leave application');
// 'Please enter the HRM_ID to cancel the sick leave application'
}


async ConfirmStep(step){
    step.values.HRMId = step.result;

    // Extracting only the date part from startDate and endDate
    // const startDate = new Date(step.values.startDate).toISOString().split('T')[0];
    // const endDate = new Date(step.values.endDate).toISOString().split('T')[0];

    let msg = `Your Sick Leave Application on following HRM_Id :
    \n HRM Id : ${step.values.HRMId} `
    
    await step.context.sendActivity(msg);
    return await step.prompt(Confirm_Prompt, 'Are you want to CANCEL your sick leave application ?', ['Yes', 'No']);

}


async summaryStep(step) {
    if (step.result === true) {
        // Business Logic
        const adaptiveCard = CardFactory.adaptiveCard(Adaptive_card());
        await step.context.sendActivity({ attachments: [adaptiveCard] });
        await step.context.sendActivity(`You Successfully cancelled your Sick Leave Application with HRMId : ${step.values.HRMId}`);
        endDialog = true;               // Set the endDialog flag to true when the dialog is complete
        return await step.endDialog();
    }
}

isDialogComplete() {
    return endDialog; // Return the class property
}
}

module.exports.CancelSickLeaveDialog = CancelSickLeaveDialog;