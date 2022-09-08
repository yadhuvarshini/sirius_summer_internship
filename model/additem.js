var mongoose = require('mongoose');

var additemschema = new mongoose.Schema({
    name:String,
    manufacturer:String,
    category:String,
    rating:Number,
    price:Number,
    image:String,
    about:String
});

module.exports = mongoose.model("additem", additemschema);