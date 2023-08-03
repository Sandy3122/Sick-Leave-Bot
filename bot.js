// // bot.js
// const { ActivityHandler, MessageFactory } = require('botbuilder');

// const { MakeSickLeaveDialog } = require('./componentDialogs/makeSickLeaveDialog')

// const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

// class SickLeaveBot extends ActivityHandler {
//     //State management objects to the constructor
//     constructor(conversationState, userState) {
//         super();

//         this.conversationState = conversationState;
//         this.userState = userState;
        
//         //Creating dialog state property accessor and this can manage the satus of particular dialog
//         this.dialogState = conversationState.createProperty('dialogState');
//         this.makeSickLeaveDialog = new MakeSickLeaveDialog(this.conversationState, this.userState)


//         this.previousIntent = this.conversationState.createProperty('previousIntent');
//         this.conversationData = this.conversationState.createProperty('conversationData');

//         // Create a property to store the state of the dialog (whether the bot has asked for the user's name or not)
//         // this.hasAskedForName = false;

//         // this.onMessage(async (context, next) => {
//         //     if (!this.hasAskedForName) {
//         //         // If the bot has not asked for the user's name, then it stores the provided name and greets the user
//         //         this.userName = context.activity.text;
//         //         await context.sendActivity(`Hello ${this.userName}, How can I help you today?`);
//         //         this.hasAskedForName = true;
//         //     } else {
//         //         // If the bot has already asked for the user's name, it acts as an echo bot
//         //         const replyText = `Echo: ${context.activity.text}`;
//         //         await context.sendActivity(MessageFactory.text(replyText, replyText));
//         //     }

//         //     await next();
//         // });


//         this.onMessage(async(context, next) => {

//             await this.dispatchToIntentAsync(context); // Call the function within the class using 'this'

//             await  next()
//         });

//         this.onDialog(async(context, next) => {

//             //Save any state changes. The load happen during the execution of the dialog
//             await this.conversationState.saveChanges(context, false);
//             await this.userState.saveChanges(context, false);
//             await next();
//         })

//         this.onMembersAdded(async (context, next) => {
//             await this.sendWelcomeMessage(context);

//             //By calling  next( you can ensure that the next BotHandler is running)
//             await next();
//         });
//     }

//     async sendWelcomeMessage(turnContext) {
//         const { activity } = turnContext;

//         for (const idx in activity.membersAdded) {
//             if (activity.membersAdded[idx].id !== activity.recipient.id) {
//                 await turnContext.sendActivity(MessageFactory.text(`👋 Hello ${activity.membersAdded[idx].name}! I'm your Sick Leave Assistant.`));
//                 // await turnContext.sendActivity(MessageFactory.text(`May I know your name, please?`));
//                 await this.sendSuggestedActivity(turnContext)
//             }
//         }
//     }


//     async sendSuggestedActivity(turnContext){
//         let reply = MessageFactory.suggestedActions(['Apply Sick Leave', 'Cancel Sick Leave'], 'What do you want me to today ?')
//         await turnContext.sendActivity(reply);
//     }

//     async dispatchToIntentAsync(context) {

//         let currentIntent = '';
//         const previousIntent = await this.previousIntent.get(context, {});
//         const conversationData = await this.conversationData.get(context, {});

//         if(previousIntent.intentName && conversationData.endDialog === false)
//         {
//             currentIntent = previousIntent.intentName;
//         }
//         else if(previousIntent.intentName && conversationData.endDialog === true)
//         {
//             currentIntent = context.activity.text;
//         }
//         else
//         {
//             currentIntent = context.activity.text;
//             await this.previousIntent.set(context, {intentName : context.activity.text})
//         }

//         switch(currentIntent)
//         {
//             case 'Apply Sick Leave':
//             console.log('Inside apply sick leave case');
//             await this.conversationData.set(context, {endDialog : false})
//             await this.makeSickLeaveDialog.run(context, this.dialogState);       // Call the dialog's run function using 'this'
//             conversationData.endDialog = await this.makeSickLeaveDialog.isDialogComplete();
//             break;
            
//             default :
//                 console.log('Did not match, Apply For Sick Leave Case');
//                 break;

//         }

//     }

// }
// module.exports.SickLeaveBot = SickLeaveBot;

const { ActivityHandler, MessageFactory } = require('botbuilder');
const { MakeSickLeaveDialog } = require('./componentDialogs/makeSickLeaveDialog');
const { CancelSickLeaveDialog } = require('./componentDialogs/cancelSickLeaveDialog');
const { DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

class SickLeaveBot extends ActivityHandler {

    constructor(conversationState, userState) {
        super();

        this.conversationState = conversationState;
        this.userState = userState;

        this.dialogState = conversationState.createProperty('dialogState');
        this.makeSickLeaveDialog = new MakeSickLeaveDialog(this.conversationState, this.userState);
        this.cancelSickLeaveDialog = new CancelSickLeaveDialog(this.conversationState, this.userState);

        this.previousIntent = this.conversationState.createProperty('previousIntent');
        this.conversationData = this.conversationState.createProperty('conversationData');

        this.onMessage(async (context, next) => {
            await this.dispatchToIntentAsync(context);
            await next();
        });

        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);
            await next();
        });
    }

    async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;

        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                await turnContext.sendActivity(MessageFactory.text(`👋 Hello ${activity.membersAdded[idx].name}! I'm your Sick Leave Assistant.`));
                await this.sendSuggestedActivity(turnContext);
            }
        }
    }

    async sendSuggestedActivity(turnContext) {
        let reply = MessageFactory.suggestedActions(['Apply Sick Leave', 'Cancel Sick Leave'], 'What do you want me to do today?');
        await turnContext.sendActivity(reply);
    }

    async dispatchToIntentAsync(context) {
        let currentIntent = '';
        const previousIntent = await this.previousIntent.get(context, {});
        const conversationData = await this.conversationData.get(context, {});

        if (previousIntent.intentName && conversationData.endDialog === false) {
            currentIntent = previousIntent.intentName;
        } else if (previousIntent.intentName && conversationData.endDialog === true) {
            currentIntent = context.activity.text;
        } else {
            currentIntent = context.activity.text;
            await this.previousIntent.set(context, { intentName: context.activity.text });
        }

        switch (currentIntent) {
            case 'Apply Sick Leave':
                console.log('Inside apply sick leave case');
                await this.conversationData.set(context, { endDialog: false });
                await this.makeSickLeaveDialog.run(context, this.dialogState);
                conversationData.endDialog = this.makeSickLeaveDialog.isDialogComplete(); // Note: No need to await here
                if(conversationData.endDialog)
                {
                    // await this.previousIntent.set(context, { intentName: null });
                    await this.previousIntent.set(context, { intentName: null });
                    await this.sendSuggestedActivity(context);
                }
                
                break;


                case 'Cancel Sick Leave':
                    console.log('Inside cancel sick leave case');
                    await this.conversationData.set(context, { endDialog: false });
                    await this.cancelSickLeaveDialog.run(context, this.dialogState);
                    conversationData.endDialog = this.cancelSickLeaveDialog.isDialogComplete(); // Note: No need to await here
                    if(conversationData.endDialog)
                    {
                        // await this.previousIntent.set(context, { intentName: null });
                        await this.previousIntent.set(context, { intentName: null });
                        await this.sendSuggestedActivity(context);
                    }

                    break;

            default:
                console.log('Did not match, Apply For Sick Leave Case');
                break;
        }
    }

}

module.exports.SickLeaveBot = SickLeaveBot;
