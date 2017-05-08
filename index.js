const Alexa = require('alexa-sdk')
const massive = require('massive')

const db = massive.connectSync({
  connectionString : "postgres://"+process.env.dbUsername+":"+process.env.dbPassword+"@"+process.env.dbEndpoint,
});

var handlersInventory= {
  'Increment': function(){
    const slots = this.event.request.intent.slots;

    db.run("update inventory set quantity = (quantity + $2) where productname like $1", ["%" + slots.item.value.toLowerCase() + "%", slots.num.value], (err,result) => {
      if(err){
        console.log(err)
      }
      this.emit(':tellWithCard', "I added " + slots.num.value + " " + slots.item.value + " guys.","Inventory Update", "I added " + slots.num.value + " " + slots.item.value)
    });
    db.run('notify "changed"');
  },

  'Decrement': function(){
    const slots = this.event.request.intent.slots;
    db.run("update inventory set quantity = (quantity - $2) where productname like $1", ["%" + slots.item.value.toLowerCase() + "%", slots.num.value], (err,result) => {
      if(err){
        console.log(err)
      }
      this.emit(':tellWithCard', "I subtracted " + slots.num.value + " " + slots.item.value + " guys.","Inventory Update", "I subtracted " + slots.num.value + " " + slots.item.value)
    });
    db.run('notify "changed"');
  },

  'GetInventory': function(){
    const slots = this.event.request.intent.slots;
    return dbPromise = new Promise ((resolve,reject)=>{
      db.run("select quantity from inventory where productname like $1", ["%" + slots.item.value.toLowerCase() + "%"], (err,result) => {
        if(err){
          console.log(err)
        }
        resolve(result[0].quantity)
      })
    }).then((result)=>this.emit(':tell', "You have " + result + " " + slots.item.value + " brother."))
  }
}

exports.handler = function(event,context,callback){
  var alexa = Alexa.handler(event,context)
  alexa.registerHandlers(handlersInventory)
  alexa.execute()
}
