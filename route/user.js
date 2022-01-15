const express = require("express")
const UserRouter = express.Router()
const {RegUser, Login, allUsers} = require("../controller/user")
const upload = require("../config/upload")
const userSchema = require("../model/userSchema")
const paginated = require("../config/pagination")


UserRouter.get("/", paginated(userSchema), allUsers)
UserRouter.post("/login", Login)
UserRouter.post("/new", upload.single("userImg"), RegUser)







module.exports = UserRouter