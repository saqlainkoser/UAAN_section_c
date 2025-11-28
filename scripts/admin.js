const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userModel = require("../models/User.js")

mongoose.connect("mongodb://localhost:27017/UAAS_SEC_C")
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err))

async function addAdminCred(){
    //salt 10
    //hash
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("12345",salt)
    
    const admin = await userModel.create({
        email:"admin@12345",
        password:hashedPassword,
        firstName:"admin",
        role:"admin"
    })

    await admin.save()

    console.log("Added Admin");
}

addAdminCred()
