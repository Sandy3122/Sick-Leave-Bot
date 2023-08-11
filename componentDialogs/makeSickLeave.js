const {WaterfallDialog, ComponentDialog, DialogSet, DialogTurnStatus, Dialog} = require('botbuilder-dialogs');

const {ConfirmPrompt, ChoicePrompt, DateTimePrompt, TextPrompt} = require('botbuilder-dialogs');

const {CardFactory} = require('botbuilder');

const {SickLeaveSuccessCard} = require('../resources/adaptiveCards/SuccesSickLeaveCard');
const {getAllDetailsCard} = require('../resources/adaptiveCards/getAllDetails');

// const {getCurrentDateTime} = require('../Utilities/dateTime')

const Confirm_Prompt = "Confirm_Prompt";
const Choice_Prompt = "Choice_Prompt";
const Text_Prompt = "Text_Prompt";
const DateTime_Prompt = "DateTime_Prompt";
const Waterfall_Dialog = "Waterfall_Dialog";
let endDialog = '';

class MakeSickLeaveDialog extends ComponentDialog{

    constructor(conversationState, userState){
        super('makeSickLeaveDialog');
        
        this.addDialog(new TextPrompt(Text_Prompt));
        this.addDialog( new DateTimePrompt(DateTime_Prompt));
        this.addDialog(new ConfirmPrompt(Confirm_Prompt));
        this.addDialog(new ChoicePrompt(Choice_Prompt));
        
        //WaterFall Dialog
        this.addDialog(new WaterfallDialog(Waterfall_Dialog, [
            this.firstStep.bind(this),          // Ask confirmation if user want to make reservation
            this.getName.bind(this),            // Get name from the user
            this.getAllDetailsStep.bind(this),  // Get All The Details
            this.ConfirmStep.bind(this),        // Show summary of values entered by user and ask confirmation to make sick leave
            this.summaryStep.bind(this)         // Final step to process the sick leave application
        ]));
            this.initialDialogId = Waterfall_Dialog;
            // this.endDialog = false; // Change endDialog to a class property
    }

    /** State property accessors are used to actually read or write one of your state properties, 
    and provide get, set, and delete methods for accessing your state properties from within a turn.
    **/
    async run(turnContext, accessor) {
        try{
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        // Check if the 'results' object is defined before accessing its properties
        if (dialogContext.activeDialog && !dialogContext.activeDialog.state) {
            await dialogContext.beginDialog(this.id);
        } 
        else {
            const results = await dialogContext.continueDialog();
            if (!results || results.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog(this.id);
            }
        }
    }
    catch(err){
        console.error(err);
    }
    }


async firstStep(step) {
    
endDialog = false;
//Running a prompt here means the next WaterFallStep will be run when the users response is received
return await step.prompt(Confirm_Prompt, 'Would you like to apply for sick leave', ['Yes', 'No']); 
    
}

async getName(step) {

    if(step.result === true)
    {
        return await step.prompt(Text_Prompt, 'What Is Your Name?');
    }
    else
    {
        await step.context.sendActivity("You Choose Not To Go Ahead With The Application");
        endDialog = true;
        return await step.endDialog();
    }
}

async getAllDetailsStep(step){
    step.values.name = step.result;
    try{
    let adaptiveCard = CardFactory.adaptiveCard(getAllDetailsCard());
    await step.context.sendActivity({ attachments: [adaptiveCard] });
    // return await step.prompt();
    return Dialog.EndOfTurn;
    }
    catch(err){
        console.error(err);
    }

}

async ConfirmStep(step){
    step.values.details = step.context.activity.value;
    console.log(step.values.details)

    let msg = `You have entered following values : 
    \n Name : ${step.values.name}
    \n HRM_Id : ${step.values.details.HrmId}
    \n Sick Leave Start Date : ${JSON.stringify(step.values.details.StartDate)}
    \n Sick Leave End Date : ${JSON.stringify(step.values.details.EndDate)}
    \n Reason : ${step.values.details.Reason}`
    await step.context.sendActivity(msg);
    return await step.prompt(Confirm_Prompt, `${step.values.name}, Are you sure that all the values are correct and you want to proceed for Sick Leave ?`, ['Yes', 'No']);

}

async summaryStep(step) {
    try{
    if (step.result === true) {
        // Business Logic
        const adaptiveCard = CardFactory.adaptiveCard(SickLeaveSuccessCard());
        await step.context.sendActivity({ attachments: [adaptiveCard] });
        await step.context.sendActivity(`${step.values.name}, Thank you for applying for sick leave. Your application has been received with Id: ${step.values.details.HrmId}.`);
        endDialog = true; // Set the endDialog flag to true when the dialog is complete
        return await step.endDialog; // Use step.endDialog() instead of step.endDialog
    }
    else{
        await step.context.sendActivity(`${step.values.name}, You Choose Not To Go Ahead With The Application`);
        endDialog = true;
        return await step.endDialog();
    }}
    catch(err){
        console.error(err);
    }
}

isDialogComplete() {
    return endDialog; // Return the class property
}
}

module.exports.MakeSickLeaveDialog = MakeSickLeaveDialog;