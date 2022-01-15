const productSchema = require("../model/productSchema")
const sharp = require("sharp")
const fs = require("fs")
const cloudinary = require("cloudinary").v2
const slugify = require("slugify")


// get all product


exports.getAllProduct = (req, res) =>{
    let results = res.paginatedResults

    res.send({
        count:results.length,
       results:results,
    

    })
} 

// add new product
exports.addproduct = async (req, res) =>{
    let {title, price,  category, description, postedBy } = req.body
    if(!title || !price ||  !category || !description || !postedBy){
       return res.status(401).json({
           msg:"please fill all field"
        })
    }
   
    if(!req.files){
        return res.status(401).json({
            msg:"please choose a photo"
        })
    }
    
        
        let productPix = [];
        
        let myfiles = req.files 
        for (const file of myfiles) {
            console.log(file.path)
            
            await sharp(file.path)
            .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .resize(500, 500)
            .png({quality:90, force: true})
            
            .toFile(`./public/upload/product/${file.filename}.png`);
            
            
            let uploadImg = await cloudinary.uploader.upload(file.path)
            fs.unlinkSync(file.path);
            
            const dbFile ={
                filename : uploadImg.secure_url
            }
            productPix.push(dbFile);
                
           }
     try {
         
     
       let newData = await productSchema.findOne({title:title})
       if(newData){
         return  res.status(300).json({
               msg:`${title} already exist`
           })
       }else{
           let myProduct = await new productSchema({
               title, 
               price, 
               category, 
               description, 
               postedBy,
               productImg:productPix
           })
           const savedProduct = await myProduct.save()
           if(savedProduct){
               console.log(savedProduct);
               return res.status(201).json({
                   msg:"product uploaded sucessfully",
                   res:"ok",
                   data:savedProduct
               })
           }else{
              return res.status(400).json({
                   msg:"something went wrong"
               })
           }
       }
   } catch (error) {
       return res.status(400).json({
           msg:error
       })
   }
   
   }

//    get single product
exports.singleProduct = async(req, res) =>{
    try {
    let product = await productSchema.findOne({slug:req.params.slug}).populate("postedBy")
        if(product){
           return res.status(201).json({
               msg:"success",
               res:"ok",
               data:product
           })
        }
    } catch (error) {
        return res.status(401).json({
            msg:error,
           
        })
    }    
}

// delete product
exports.deleteProductById = async(req, res) =>{
    try {
    let deleteProduct = await productSchema.findByIdAndDelete(req.params.id)
    if(deleteProduct){
       return res.status(200).json({
            msg:"product deleted successfully",
            res:"ok",
            data:deleteProduct
        })
    }

    } catch (error) {
        return res.status(401).json({
            msg:error,
            
        })
    }
}

// edit product
exports.Editproduct = async(req, res) =>{
    let {title, price, qty, category, description } = req.body
    let productPix = [];
       
    if(req.files){
        let myfiles = req.files 
    for (const file of myfiles) {
  
            await sharp(file.path)
            .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
            .resize(500, 500)
            .png({quality:90, force: true})
        
            .toFile(`../counter/src/component/upload/product/${file.filename}.png`);
        
        
          fs.unlinkSync(file.path);
          const dbFile ={
                filename : file.filename,
                size:file.size
              }
              productPix.push(dbFile);
        }
    }
    try {
        let oldProduct = await productSchema.findById(req.params.id)
     
        console.log(oldProduct.productImg[0]);
        let edit = await productSchema.findOneAndUpdate({_id:req.params.id}, {$set:{
            title:title || oldProduct.title,
            price:price || oldProduct.price,
            qty:qty || oldProduct.qty,
            category:category || oldProduct.category,
            description:description || oldProduct.description,
            productImg:productPix || oldProduct.productImg   
        
        }},{new:true})
        
        if(!edit){
            return res.status(401).json({
                msg:"unable to update file"
            })
        }else{

        
            return res.status(201).json({
                msg:"product updated successfully",
                res:"ok",
                data:edit
            })}
    } catch (error) {
        return res.status(401).json({
            msg:error
        })
    }
}


exports.Search = async(req, res) =>{

    let results = res.paginatedResults

    res.send({
        count:results.length,
       results:results,
    

    })

}