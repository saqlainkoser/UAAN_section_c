const express = require("express")
const mongoose = require("mongoose")
const app = express()
const userModel = require("./models/User")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const { isAuthenticated, checkRole } = require("./middlewares/auth")
const { deptModel } = require("./models/Department")
const cookieParser = require("cookie-parser")

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//session creating
app.use(session({
    name : "sid",
    secret : "secret",
    resave : false,
    saveUninitialized : false,
    rolling:true,
    cookie:{
        maxAge : 1000 * 30 
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
    else{
        req.session.user = user
        res.redirect("/admin/dashboard")
    } 
})
//admin dashboard route 

app.get("/admin/dashboard",isAuthenticated,checkRole("admin"),(req,res)=>{
    let message = ""
    if(req.cookies.flashmsg){
        message = req.cookies.flashmsg
        res.cookie("flashmsg","")
    }
    res.render("dashboard",{message})
})

app.get("/create-department",isAuthenticated,checkRole("admin"),(req,res)=>{
    res.render("create-department")
})

app.post("/create-department",isAuthenticated,checkRole("admin"),async (req,res)=>{
    const {name,type,address} = req.body
    if(!name && !type && !address){
        res.status(400).json({message:"Fill all the fields"})
    }
    //department
    const newDept =await deptModel.create({
        name:name,
        type:type,
        address:address
    })

    await newDept.save()
    res.cookie("flashmsg","Department Created")
    res.redirect("/admin/dashboard")
})

app.get("/departments",(req,res)=>{
    res.render("departments",{
    departments: [
        { name: "Civil Engineering", type: "Engineering", userCount: 85 },
        { name: "Electrical Engineering", type: "Engineering", userCount: 92 },
        { name: "Mechanical Engineering", type: "Engineering", userCount: 78 },
        { name: "Computer Science", type: "Engineering", userCount: 120 },
        { name: "Physics", type: "Science", userCount: 65 },
        { name: "Chemistry", type: "Science", userCount: 58 }
    ]
})
})

app.listen(3007,(req,res)=>{
    console.log("Server is running on http://localhost:3007/login");
})