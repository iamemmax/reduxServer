const mongoose = require("mongoose")
const slugify = require("slugify")
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        
    },
    price:{
        type:Number,
        required:true,
        
    },
    category:{
        type:String,
        required:true,
        
    },
    productImg:[],

    qty:{
        type:Number,
        required:true,
        default :"1"
    },
    description:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        unique:true,
        required:true,
        
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    postedBy:{
        
        type:mongoose.Schema.Types.ObjectId,
             ref:"user"

    },
    
})

productSchema.pre("validate", function(next){
    this.slug = slugify(this.title, {
        lower:true,
        // strict:true
    })
   

    next()
})

module.exports = mongoose.model("products", productSchema)