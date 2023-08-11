const {
  CancelSickLeaveDialog,
} = require("../../componentDialogs/cancelSickLeaveDialog");

module.exports = {
  Adaptive_card: () => {
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
          text: "Sick Leave Application Canceled",
          size: "Large",
          weight: "Bolder",
          wrap: true,
          color: "Attention",
        },
        {
          type: "TextBlock",
          text: `Your sick leave application has been successfully canceled.`,
          wrap: true,
        },
        {
          type: "TextBlock",
          text: "If you have any questions or need further assistance, please contact HR.",
          wrap: true,
        },
      ],
    };
  },
};
