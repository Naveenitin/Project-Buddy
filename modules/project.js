var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    name: String,
    type: String,
    image: String,
    idea: String,
    username: String,
    description: String,
    url: String,
    like:{type:Number, default:0},
    comment:Array,
    date:{type: Date, default: Date.now},
    s:{type: Number, default: 0}
    
});

module.exports = mongoose.model("project",projectSchema);