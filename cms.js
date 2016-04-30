//Declare a collection in the Mongo database
Things = new Mongo.Collection("things");

Router.configure({
  layoutTemplate: 'layout'
});

Router.onAfterAction(function() {
  document.title = 'W e  T a k e  P a r t ( s )';
  Session.set('submitting', false);
});

// About page
Router.route('/about', {
  template: 'about',
  name: 'about'
});

// For a list of parts, the data context is the parent part
Router.route('/:_id', {
  template: 'parts',
  name: 'parts',
  data: function() {
    return Things.findOne({_id: this.params._id});
  }
});

// Home page
Router.route('/', {
  template: 'experiences',
  name: 'experiences'
});

//if (Meteor.isClient) executes only on the client
if (Meteor.isClient) {
  
  // Global helper
  // Template.registerHelper('total_parts', function() {
  // Template.layout.helpers({
  //   total_parts: function() {
  //     return Things.find().count() + 'total parts';
  //   }
  // });

  Template.experiences.helpers({
    experiences: function() {
      return Things.find({parent_id: null}, {sort: {created: -1}});
    }
  })
  
  Template.parts.helpers({
    parts: function() {
      return Things.find({parent_id: this._id}, {sort: {created: -1}});
    }
  })

  Template.submit.helpers({
    submitting: function() {
      return Session.get('submitting');
    }
  });
  
  Template.new_entry_button.events({
    "click .new_entry_button": function(event) {
      Session.set('submitting', true);
      Meteor.defer(function() { $('#entry_name').focus(); });
    }
  })

  
    Template.cancel_entry_button.events({
    "click .cancel_entry_button": function(event) {
      Session.set('submitting', false);
    }
  })
  
//  Template.thing.helpers({
//    has_parts: function() {
//      if (Things.find({parent_id: this._id}).count() > 0) {
//        return '&#8598;';
//      }
//      var c = Things.find({parent_id: this._id}).count();
//      if (c > 0) {
//         return '<span class="has_parts">' + c + '</span>';
//       }
//       else {
//         return '<span class="no_parts">0</span>';
//       }
//      }
//    }
//  )
  
  Template.thing.events({
    "click a.delete": function(event) {
      
      event.preventDefault();
      //Using the Mongo ID of this template's object,
      //tell Mongo to remove the object from the database.
      Things.remove(this._id);
    }
  });
  
  Template.entry_form.helpers({
    
    share_placeholder: function() {
      // Both of these approaches work the same
      //if (Router.current().route.getName() == 'parts') {
      if (this._id) {
        return 'Share part';
      }
      else {
        return 'Share experience';
      }
    }
    
  })
  
  Template.entry_form.events({
    
    "submit": function(event) {
      
      event.preventDefault();//Tell browser not to refresh, which is the default behavior.
      var form = event.target; //Get the <form> html element, the target of the submit event.
      
      //Insert a thing record into the Things db collecton
      Things.insert({
        experience: form.experience.value,
        submitter: form.submitter.value,
        parent_id: this._id || null,
        created: new Date()
      });
      
      //Clear the text fields of the form
      form.experience.value = '';
      form.submitter.value = '';

      //Focus the name field
      form.experience.focus();
      
      Session.set('submitting', false);
      
    }
  });

}