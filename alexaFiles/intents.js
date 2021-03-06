{
    "intents": [
        {
            "intent": "Increment",
            "slots": [
                {
                    "name": "item",
                    "type": "AMAZON.Food"
                }, {
                    "name": "num",
                    "type": "AMAZON.NUMBER"
                }
            ]
        }, {
            "intent": "Decrement",
            "slots": [
                {
                    "name": "item",
                    "type": "AMAZON.Food"
                }, {
                    "name": "num",
                    "type": "AMAZON.NUMBER"
                }
            ]
        }, {
            "intent": "GetInventory",
            "slots": [
                {
                    "name": "item",
                    "type": "AMAZON.Food"
                }
            ]
        }, {
            "intent": "InsertItem",
            "slots": [
                {
                    "name": "item",
                    "type": "AMAZON.Food"
                }, {
                    "name": "num",
                    "type": "AMAZON.NUMBER"
                }
            ]
        }, {
            "intent": "DeleteItem",
            "slots": [
                {
                    "name": "item",
                    "type": "AMAZON.Food"
                }, {
                  "name": "password",
                  "type": "AMAZON.Comic"
                }
            ]
        }
    ]
}
