const Alexa = require('alexa-sdk')
const massive = require('massive')

const db = massive.connectSync({
  connectionString : "postgres://"+process.env.dbUsername+":"+process.env.dbPassword+"@"+process.env.dbEndpoint,
});

var handlersInventory= {
  'Increment': function(){
    const slots = this.event.request.intent.slots;
    db.run("update inventory set quantity = (quantity + $2) where productname = $1", [slots.item.value, slots.num.value], (err,result) => {
      if(err){
        console.log(err)
      }
      this.emit(':tell', "I added " + slots.num.value + " " + slots.item.value + " guys.")
    });
  },

  'Decrement': function(){
    const slots = this.event.request.intent.slots;
    db.run("update inventory set quantity = (quantity - $2) where productname = $1", [slots.item.value, slots.num.value], (err,result) => {
      if(err){
        console.log(err)
      }
      this.emit(':tell', "I subtracted " + slots.num.value + " " + slots.item.value + " guys.")
    });
  },

  'GetInventory': function(){
    const slots = this.event.request.intent.slots;
    db.run("select quantity from inventory where productname = $1", [slots.item.value], (err,result) => {
      const num = result.data.quantity;
      if(err){
        console.log(err)
      }
      this.emit(':tell', "You have " + slots.num.value + " " + slots.item.value + " brother.")
    });
  }
}

exports.handler = function(event,context,callback){
  var alexa = Alexa.handler(event,context)
  alexa.registerHandlers(handlersInventory)
  alexa.execute()
}
