const mongoose = require("mongoose")

const deptSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        unique : true
    },
    type:{
        type:String,
        enum : ["UG","PG","Research"],
        required : true
    },
    address : String
})

const deptModel = mongoose.model("department",deptSchema)

module.exports = {deptModel}