const UserSchema = require("../model/userSchema")
const sharp = require("sharp")
const fs = require("fs")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const cloudinary = require("cloudinary").v2

exports.allUsers = async(req, res) =>{let results = res.paginatedResults

    res.send({
        count:results.length,
       results:results,
    

    })
} 
exports.RegUser = async(req, res) =>{

    let {username, email, password, password2} = req.body
    if(!username || !email || !password || !password2){
        return res.status(401).json({
            msg:"Please fill all field"
        })
    }

    console.log(username, email, password, password2);
    if(password !== password2){
        return res.status(401).json({
            msg:"password not match"
        })
    }
    if(!req.file){
        return res.status(401).json({
            msg:"Please choose a file"
        })
    }
// check if user enter valid email
    function validateEmail(email) {
        const regex =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
      }
      if (!validateEmail(email)) {
         return res.status(401).json({
             msg:"please enter a valid email"
            })
        }
        
        try {
            // if(req.file){
                await sharp(req.file.path)
                .flatten({ background: { r: 255, g: 255, b: 255, alpha: 0 } })
                .resize(200, 200)
                .png({quality:90, force: true})
                .toFile(`./public/upload/user/${req.file.filename}.png`);
                
                let uploadImg = await cloudinary.uploader.upload(req.file.path)
        
        
         fs.unlinkSync(req.file.path);
   
     

        
        
    
  
        // find if user already exist with this username
        let user = await UserSchema.findOne({email:email})
        if(user){
            return res.status(401).json({
                msg:"user already exist"
            })
        }else{

            let newUser = new UserSchema({
                username, 
                email,
                password,
                userImg:uploadImg.secure_url
            })
            let saveduser = await newUser.save()
            if(saveduser){
                console.log(saveduser);
                return res.status(201).json({
                    msg:"registration successful",
                    res:"ok",
                    data:saveduser
                })
            }
        else{
               
                return res.status(401).json({
                    msg:"something went wrong"
                })
            }
         }
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg:error
        })
    }
}


exports.Login = async(req, res, next) =>{
    let {email, password} = req.body

    if(!email || !password){
        return res.status(401).json({
            msg:"Please fill all field"
        })
    }

    // check if user enter valid email
    function validateEmail(email) {
        const regex =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
      }
      if (!validateEmail(email)) {
         return res.status(401).json({
            msg:"please enter a valid email"
        })
      }

      
      passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json({
            msg:"Email or password not correct"
        })}
        req.logIn(user, function(err) {
          if (err) { 
             next(err)
            return res.status(401).json({
                msg:"Email or password not correct"
            })
        }

            console.log(req.session);
            console.log(req.user);
          return  res.status(201).json({

                msg:`logged in ${req.user.username}`,
                    isAuthenticated:true,
                    res:"ok",
                    user:req.user
                })
        });
      })(req, res, next);
      
    

}
