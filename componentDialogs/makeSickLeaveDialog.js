const {WaterfallDialog, ComponentDialog, DialogSet, DialogTurnStatus} = require('botbuilder-dialogs');

const {ConfirmPrompt, ChoicePrompt, DateTimePrompt, TextPrompt} = require('botbuilder-dialogs');

const Confirm_Prompt = "Confirm_Prompt";
const Choice_Prompt = "Choice_Prompt";
const Text_Prompt = "Text_Prompt";
const DateTime_Prompt = "DateTime_Prompt";
const Waterfall_Dialog = "Waterfall_Dialog";
// const endDialog = '';

class MakeSickLeaveDialog extends ComponentDialog{

    constructor(conversationState, userState){
        super('makeSickLeaveDialog');

        this.addDialog(new TextPrompt(Text_Prompt));
        this.addDialog( new DateTimePrompt(DateTime_Prompt));
        this.addDialog(new ConfirmPrompt(Confirm_Prompt));
        this.addDialog(new ChoicePrompt(Choice_Prompt));
        
        //WaterFall Dialog
        this.addDialog(new WaterfallDialog(Waterfall_Dialog, [
            this.firstStep.bind(this),          // Ask confirmatiopn if user want to make reservation
            this.getName.bind(this),            // Get name from the user
            this.getId.bind(this),            // Get HRM_ID from the user
            this.getStartDate.bind(this),       // Get Start Date from the user
            this.getEndDate.bind(this),         // Get End Date from the user
            this.getReason.bind(this),          // Get Reason from the user
            this.ConfirmStep.bind(this),        // Show summary of values entered by user and ask confirmation to make sick leave
            this.summaryStep.bind(this)         // Final step to process the sick leave application
        ]));
            this.initialDialogId = Waterfall_Dialog;
            this.endDialog = false; // Change endDialog to a class property
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
    
this.endDialog = false;
//Running a prompt here means the next WaterFallStep will be run when the users response is received
return await step.prompt(Confirm_Prompt, 'Would you like to apply for sick leave', ['Yes', 'No']); 
    
}

async getName(step) {

    if(step.result === true)
    {
        return await step.prompt(Text_Prompt, 'What is your name?');
    }
    if(step.result === false)
    {
        await step.context.sendActivity("You Choose Not To Go Ahead With The Application");
        this.endDialog = true;
        return await step.endDialog();
    }

}

async getId(step) {

    step.values.name = step.result;
    return await step.prompt(Text_Prompt, 'Please Enter Your HRM_Id');
}

async getStartDate(step) {
    step.values.id = step.result;
    return await step.prompt(DateTime_Prompt, { prompt: "Please enter the start date for your sick leave.", dateResolutionMode: 'date' });
}

async getEndDate(step) {
    step.values.startDate = step.result;
    return await step.prompt(DateTime_Prompt, { prompt: "Please enter the end date for your sick leave.", dateResolutionMode: 'date' });
}


async getReason(step) {
    step.values.endDate = step.result;
    // Assuming you have added the 'TextPrompt' with the ID 'Text_Prompt' to the dialog earlier
    return await step.prompt(Text_Prompt, "Please enter the reason for your sick leave.");
}


async ConfirmStep(step){
    step.values.reason = step.result;

    // Extracting only the date part from startDate and endDate
    // const startDate = new Date(step.values.startDate).toISOString().split('T')[0];
    // const endDate = new Date(step.values.endDate).toISOString().split('T')[0];

    let msg = `You have entered following values : 
    \n Name : ${step.values.name}
    \n HRM_Id : ${step.values.id}
    \n Sick Leave Start Date : ${JSON.stringify(step.values.startDate)}
    \n Sick Leave End Date : ${JSON.stringify(step.values.endDate)}
    \n Reason : ${step.values.reason}`

    await step.context.sendActivity(msg);
    return await step.prompt(Confirm_Prompt, 'Are you sure that all the values are correct and you want to apply for Sick Leave ?', ['Yes', 'No']);

}


async summaryStep(step) {
    if (step.result === true) {
        // Business Logic
        await step.context.sendActivity('Thank you for applying for sick leave. Your application has been received.');
        this.endDialog = true; // Set the endDialog flag to true when the dialog is complete
        return await step.endDialog; // Use step.endDialog() instead of step.endDialog
    }
}

isDialogComplete() {
    return this.endDialog; // Return the class property
}
}

module.exports.MakeSickLeaveDialog = MakeSickLeaveDialog;


