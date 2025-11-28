const express = require("express")
const mongoose = require("mongoose")
const app = express()
const userModel = require("./models/User")
const bcrypt = require("bcryptjs")
const session = require("express-session")


app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))

//session creating
app.use(session({
    name : "sid",
    secret : "secret",
    resave : false,
    saveUninitialized : false,
    rolling:true,
    cookie:{
        maxAge : 60 * 1000 * 5 
    }
}))


mongoose.connect("mongodb://localhost:27017/UAAS_SEC_C")
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err))

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        res.status(400).json({message:"Enter Email and Password"})
    }

    const user = await userModel.findOne({email:email})
    if(!user){
        res.status(400).json({message:"Enter Valid Email and Password"})
    }

    const validUser   = await bcrypt.compare(password,user.password)
    if(!validUser){
        res.status(400).json({message:"Incorrect Password"})
    }
    res.redirect("/admin/dashboard")
})
//admin dashboard route 

app.get("/admin/dashboard",(req,res)=>{
    res.render("dashboard")
})




app.listen(3001,(req,res)=>{
    console.log("Server is running on http://localhost:3001/login");
})