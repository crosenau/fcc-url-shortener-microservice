'use strict';

const mongodb = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true } );

const Schema = mongoose.Schema;
const urlSchema = new Schema ({
  original_url: String,
  short_url: Number
});

function testMongo() {
  const Schema = mongoose.Schema;
  const personSchema = new Schema ({
    name: {
      type: String,
      required: true    
    },
    age: Number,
    favoriteFoods: [String]
  });

  const Person = mongoose.model('Person', personSchema);
  
  Person.find({ name: /\w/ }, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log(data);
    }
  });

}


exports.testMongo = testMongo;