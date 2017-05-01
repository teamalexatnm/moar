const Alexa = require('alexa-sdk')
const massive = require('massive')

const db =  massive.connectSync({
  connectionString : "postgres://tdmDB42:cchrch06@firstproject.cdnajkbiayjp.us-west-2.rds.amazonaws.com:5432/firstProjectDB",
});

var handlersInventory= {
  'IncrementLemons': function(){
    db.run("update inventory set quantity = (quantity + 1) where productname = 'lemons'", (err,result) => {
      if(err){
        console.log(err)
      }
      this.emit(':tell', "I added one to lemons guys.")
    });

  }
}

exports.handler = function(event,context,callback){
  var alexa = Alexa.handler(event,context)
  alexa.registerHandlers(handlersInventory)
  alexa.execute()
}
