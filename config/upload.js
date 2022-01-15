const multer =  require("multer")


const storage = multer.diskStorage({
    filename:(req, file, cb)=>{
        cb(null,  file.fieldname + '-' + Date.now() + file.originalname)
    },
    destination:(req, file, cb) =>{
        cb(null, "./public/upload")
        
    }
})



const upload = multer({storage:storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('File types allowed .jpeg, .jpg and .png!'));
        }
        // if(file.length >= 6){
        //     cb(null, false);
        //     return cb(new Error('only 6 images allow'));
        // }
    }
})



module.exports = upload




