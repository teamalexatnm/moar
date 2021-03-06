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
      this.emit(':tellWithCard', slots.num.value + " " + slots.item.value + " added","Inventory Update", "I added " + slots.num.value + " " + slots.item.value)
    });
    db.run('notify "changed"');
  },

  'Decrement': function(){
    const slots = this.event.request.intent.slots;
    db.run("update inventory set quantity = (quantity - $2) where productname like $1", ["%" + slots.item.value.toLowerCase() + "%", slots.num.value], (err,result) => {
      if(err){
        console.log(err)
      }
      this.emit(':tellWithCard', slots.num.value + " " + slots.item.value + " subtracted.","Inventory Update", "I subtracted " + slots.num.value + " " + slots.item.value)
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
    }).then((result)=>this.emit(':tell', "You have " + result + " " + slots.item.value))
  },

  'InsertItem': function(){
    const slots = this.event.request.intent.slots;
    db.run("insert into inventory (productname, quantity) values ($1, $2)",[slots.item.value.toLowerCase(), slots.num.value], (err, result) => {
    if(err){
      console.log(err);
    }
    this.emit(':tellWithCard', "Product " + slots.item.value + " added with quantity" + slots.num.value, "Inventory Update", "I created the product " + slots.item.value + " with a quantity of " + slots.num.value)
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
  this.emit(':tellWithCard', "Password Correct, " + slots.item.value + " removed", "Inventory Update", "I removed the product " + slots.item.value)
});
db.run('notify "changed"');
}
else {
  this.emit(':tellWithCard', "Denied. Password Incorrect", "Inventory Update", "Attempted row delete, password incorrect")
}
}

}

exports.handler = function(event,context,callback){
  var alexa = Alexa.handler(event,context)
  alexa.registerHandlers(handlersInventory)
  alexa.execute()
}
