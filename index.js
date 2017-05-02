const Alexa = require('alexa-sdk')
const massive = require('massive')

const db = massive.connectSync({
  connectionString : "postgres://"+process.env.dbUsername+":"+process.env.dbPassword+"@"+process.env.dbEndpoint,
});

var handlersInventory= {
  'Increment': function(item, num){ // Changed IncrementLemons to Increment
    db.run("update inventory set quantity = (quantity + $2) where productname = $1", [item, num], (err,result) => {
      if(err){ //In the line above, item correlates to $1 and num correlates to $2 because of their placement in the passed in array.
        console.log(err)
      }
      this.emit(':tell', "I added " + num + item + " guys. Be more grateful. This is hard work.")
    }); //In the line above, num and item are being passed in from the parameters of the 'Increment' function.
  }

  'Decrement': function(item, num){ // Copied from Increment. Check notes above for more detailed info. 
    db.run("update inventory set quantity = (quantity - $2) where productname = $1", [item, num], (err,result) => {
      if(err){
        console.log(err)
      }
      this.emit(':tell', "I subtracted " + num + item + " guys. What is wrong with you? You're losing merch!")
    });
  }

  'GetInventory': function(item){
    db.run("select quantity from inventory where productname = $1", [item], (err,result) => {
      const num = result.data.quantity;
      if(err){
        console.log(err)
      }
      this.emit(':tell', "You have " + num + item + " brother.")
    });
  }
}

exports.handler = function(event,context,callback){
  var alexa = Alexa.handler(event,context)
  alexa.registerHandlers(handlersInventory)
  alexa.execute()
}
