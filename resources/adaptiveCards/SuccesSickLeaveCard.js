// const { CancelSickLeaveDialog } = require('../../componentDialogs/cancelSickLeaveDialog');
module.exports = {
  SickLeaveSuccessCard: () => {
    return {
      type: "AdaptiveCard",
      version: "1.3",
      body: [
        {
          type: "Image",
          url: "https://celebaltech.com/assets/img/celebal.webp",
          size: "Medium",
        },
        {
          type: "TextBlock",
          text: "Sick Leave Applied Successfully!",
          size: "Large",
          weight: "Bolder",
          color: "Good",
        },
        {
          type: "TextBlock",
          text: "Your sick leave application has been submitted successfully. You will be notified once it is approved.",
          wrap: true,
        },
      ],
    };
  },
};
