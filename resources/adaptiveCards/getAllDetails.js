module.exports = {
    getAllDetailsCard: () => {
        return {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.3",
            "body": [
                {
                    "type": "Image",
                    "id": "celebal Image",
                    "url": "https://celebaltech.com/assets/img/celebal.webp",
                    "size": "Medium"
                },
                {
                    "type": "TextBlock",
                    "text": "Sick Leave Application",
                    "wrap": true,
                    "id": "Heading",
                    "spacing": "Medium",
                    "horizontalAlignment": "Center",
                    "fontType": "Default",
                    "size": "ExtraLarge",
                    "weight": "Bolder",
                    "color": "Good",
                    "isSubtle": false,
                    "separator": true,
                    "height": "stretch"
                },
                {
                    "type": "Input.Text",
                    "placeholder": "Enter Your HRM_Id (HRM1234)",
                    "id": "HrmId",
                    "label": "Enter HRM_Id",
                    "value": "HRM",
                    "isRequired": true,
                    "errorMessage": "Please Enter Your HRM_Id",
                    "maxLength": 5,
                    "$data": "${$root}",
                    "spacing": "Medium"
                },
                {
                    "type": "Input.Date",
                    "id": "StartDate",
                    "isRequired": true,
                    "errorMessage": "Please Select The Start Date",
                    "separator": true,
                    "label": "Select Start Date",
                    "$data": "${$root}",
                    "spacing": "Medium"
                },
                {
                    "type": "Input.Date",
                    "id": "EndDate",
                    "separator": true,
                    "isRequired": true,
                    "errorMessage": "Please Select The End date",
                    "label": "Select End Date",
                    "$data": "${$root}",
                    "spacing": "Medium"
                },
                {
                    "type": "Input.Text",
                    "placeholder": "Give Reason For Sick Leave",
                    "id": "Reason",
                    "label": "Give Reason For Sick Leave",
                    "maxLength": 14,
                    "spacing": "Medium",
                    "isMultiline": true,
                    "isRequired": true,
                    "errorMessage": "Please Enter Your Reason For Sick Leave",
                    "$data": "${$root}",
                    "separator": true
                },
                {
                    "type": "ActionSet",
                    "id": "action",
                    "spacing": "Medium",
                    "separator": true,
                    "horizontalAlignment": "Center",
                    "actions": [
                        {
                            "type": "Action.Submit",
                            "title": "Submit",
                            "id": "submit"
                        }
                    ]
                }
            ]
        }
    }
}