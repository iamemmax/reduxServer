const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    userImg:[],

    createdAt:{
        type:Date,
        default:Date.now()
    }
})

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(15)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.verifyPassword = async function (enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}

module.exports = mongoose.model("user", UserSchema)