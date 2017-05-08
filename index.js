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
  },

  'InsertItem': function(){
    const slots = this.event.request.intent.slots;
    db.run("insert into inventory (productname, quantity) values ($1, $2)",[slots.item.value, slots.num.value], (err, result) => {
    if(err){
      console.log(err);
    }
    this.emit(':tellWithCard', "I added the product " + slots.item.value + " with a quantity of " + slots.num.value + " just for you sexy lads.", "Inventory Update", "I created the product " + slots.item.value + " with a quantity of " + slots.num.value)
  });
  db.run('notify "changed"');
},
'DeleteItem': function(){
  const slots = this.event.request.intent.slots;
  if (slots.password.value === 'batman'){
  db.run("delete from inventory where productname like $1",["%" + slots.item.value + "%"], (err, result) => {
  if(err){
    console.log(err);
  }
  this.emit(':tellWithCard', "Password Correct, I deleted the " + slots.item.value + " row, those poor " + slots.item.value, "Inventory Update", "I removed the product " + slots.item.value)
});
db.run('notify "changed"');
}
else {
  this.emit(':tellWithCard', "The password is wrong, I will not delete that you filthy liar!", "Inventory Update", "Attempted row delete, password incorrect")
}
}

}

exports.handler = function(event,context,callback){
  var alexa = Alexa.handler(event,context)
  alexa.registerHandlers(handlersInventory)
  alexa.execute()
}
