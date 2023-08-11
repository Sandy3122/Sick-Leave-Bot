const { ActivityHandler, MessageFactory } = require("botbuilder");
const {
  MakeSickLeaveDialog,
} = require("./componentDialogs/makeSickLeave");
const {
  CancelSickLeaveDialog,
} = require("./componentDialogs/cancelSickLeaveDialog");
const { DialogSet, DialogTurnStatus } = require("botbuilder-dialogs");
// const { CLURecognizer } = require('botbuilder-ai');

class SickLeaveBot extends ActivityHandler {
  constructor(conversationState, userState) {
    super();

    this.conversationState = conversationState;
    this.userState = userState;

    this.dialogState = conversationState.createProperty("dialogState");

    // this.conversationState: This seems to be a reference to the conversationState object, which is typically used to manage conversation-specific data and state in a chatbot application.
    // this.userState: This is a reference to the userState object, which is typically used to manage user-specific data and state in a chatbot application.
    this.makeSickLeaveDialog = new MakeSickLeaveDialog( this.conversationState, this.userState);
    this.cancelSickLeaveDialog = new CancelSickLeaveDialog( this.conversationState, this.userState);

    this.previousIntent =
      this.conversationState.createProperty("previousIntent");
    this.conversationData =
      this.conversationState.createProperty("conversationData");

    // const dispatchRecognizer = new LuisRecognizer({
    //     applicationId: process.env.LuisAppId,
    //     endpoint: process.env.LuisAPIEndpoint,
    //     endpoint: `https://${process.env.LuisAPIHostName}.api.congnitive.microsoft.com`
    //     // endpoint: 'https://customelanguagedemo.cognitiveservices.azure.com/'
    // },
    // {
    //     inCludeAllIntents: true,
    //     includeInstanceData: true
    // }, true

    // )

    this.onMessage(async (context, next) => {
      console.log('onMessage Event Is Triggered')
      // const luisResult = await dispatchRecognizer.recognize(context);
      // console.log(luisResult)

      await this.dispatchToIntentAsync(context);
      await next();
    });

    this.onDialog(async (context, next) => {
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
      await next();
    });

    //This Code Shows If any members is added to the bot
    this.onMembersAdded(async (context, next) => {
      console.log('onMemberAdded Event Is Triggered')
      await this.sendWelcomeMessage(context);
      await next();
    });
  }

  async sendWelcomeMessage(turnContext) {
    const { activity } = turnContext;

    for (const idx in activity.membersAdded) {
      if (activity.membersAdded[idx].id !== activity.recipient.id) {
        await turnContext.sendActivity(
          MessageFactory.text(
            `👋 Hello ${activity.membersAdded[idx].name}! I'm your Sick Leave Assistant.`
          )
        );
        await this.sendSuggestedActivity(turnContext);
      }
    }
  }

  async sendSuggestedActivity(turnContext) {
    let reply = MessageFactory.suggestedActions(
      ["Apply Sick Leave", "Cancel Sick Leave"],
      "What do you want me to do today?"
    );
    await turnContext.sendActivity(reply);
  }

  async dispatchToIntentAsync(context) {
    let currentIntent = "";
    const previousIntent = await this.previousIntent.get(context, {});
    const conversationData = await this.conversationData.get(context, {});

    if (previousIntent.intentName && conversationData.endDialog === false) {
      currentIntent = previousIntent.intentName;
    } else if (
      previousIntent.intentName &&
      conversationData.endDialog === true
    ) {
      currentIntent = context.activity.text;
    } else {
      currentIntent = context.activity.text;
      await this.previousIntent.set(context, {
        intentName: context.activity.text,
      });
    }

    switch (currentIntent) {
      case "Apply Sick Leave":
        console.log("Inside apply sick leave case");
        await this.conversationData.set(context, { endDialog: false });
        await this.makeSickLeaveDialog.run(context, this.dialogState);
        conversationData.endDialog =
          this.makeSickLeaveDialog.isDialogComplete(); // Note: No need to await here
        if (conversationData.endDialog) {
          // await this.previousIntent.set(context, { intentName: null });
          await this.previousIntent.set(context, { intentName: null });
          await this.sendSuggestedActivity(context);
        }
        break;

      case "Cancel Sick Leave":
        console.log("Inside cancel sick leave case");
        await this.conversationData.set(context, { endDialog: false });
        await this.cancelSickLeaveDialog.run(context, this.dialogState);
        conversationData.endDialog = this.cancelSickLeaveDialog.isDialogComplete(); // Note: No need to await here
        if (conversationData.endDialog) {
          // await this.previousIntent.set(context, { intentName: null });
          await this.previousIntent.set(context, { intentName: null });
          await this.sendSuggestedActivity(context);
        }

        break;

      default:
        console.log("Did not match, Apply For Sick Leave Case");
        break;
    }
  }
}

module.exports.SickLeaveBot = SickLeaveBot;



