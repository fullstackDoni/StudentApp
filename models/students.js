const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/university'

let StudSchema = new mongoose.Schema({
    name:{  
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    profession:{
        type:String,
        require:true,
    },
    course:{
        type:String,
        require:true
    },

});
let Student = new mongoose.model("students",StudSchema)
module.exports = mongoose.model("Student",StudSchema);