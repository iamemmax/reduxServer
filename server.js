const express = require("express")
const app = express()
    require("dotenv").config()
const cors = require("cors")
const UserRouter = require("./route/user")
const Product = require("./route/product")
const mongoose = require("mongoose")
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session")
const passport = require("passport")
const cloudinary = require("cloudinary").v2
const path = require("path")
const compression = require("compression")
const paginated = require("./config/pagination")


// middlewares
app.use(cors())

app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
app.use(compression({ filter: shouldCompress }))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

// database connection
mongoose.connect(process.env.db_connect, {
    useNewUrlParser: true, useUnifiedTopology: true 
}, (err) =>{
    if(err){
        console.log("database error", err);
        
    }else{
        console.log("database connected successfully");
        console.log("database connected successfully");

    }
})
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRETE,
    secure:true
})
app.use(session({
    secret:"emmalex",
    cookie:{maxAge: 10000000000},
    resave:true,
    saveUninitialized:true
}))

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport)


// routes
app.use("/user/", UserRouter)
app.use("/product/", Product)



const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}`);
})