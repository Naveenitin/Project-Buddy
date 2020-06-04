var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    name: String,
    type: String,
    idea: String,
    description: String,
    url: String,
    date:{type: Date, default: Date.now},
    s:{type: Number, default: 0}
    
});

module.exports = mongoose.model("project",projectSchema);