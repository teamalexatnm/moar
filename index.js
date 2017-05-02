const Alexa = require('alexa-sdk')
const massive = require('massive')

const db = massive.connectSync({
  connectionString : "postgres://"+process.env.dbUsername+":"+process.env.dbPassword+"@"+process.env.dbEndpoint,
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
