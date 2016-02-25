//Declare a collection in the Mongo database
var Things = new Mongo.Collection("things");


//This code executes only on the client
if (Meteor.isClient) {
  
  Template.body.helpers({
    
    //The things helper returns a list of the things
    things: function() {
      //Find all the things in the Mongo database and return them
      return Things.find();
    }
    
  });
  
  Template.thing.events({
    "click a.delete": function(event) {
      
      event.preventDefault();
      //Using the Mongo ID of this template's object,
      //tell Mongo to remove the object from the database.
      Things.remove(this._id);
    }
  });
  
  Template.new.events({
    
    "submit": function(event) {
      
      event.preventDefault();//Tell browser not to refresh, which is the default behavior.
      var form = event.target; //Get the <form> html element, the target of the submit event.
      
      //Insert a thing record into the Things db collecton
      Things.insert({
        submitter: form.submitter.value,
        part: form.part.value,
        description: form.description.value
      });
      
      //Clear the text fields of the form
      form.submitter.value = '';
      form.part.value = '';
      form.description.value = '';
      
      //Focus the name field
      form.submitter.focus();
    }
  });
  
}