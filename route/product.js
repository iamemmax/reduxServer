const router = require("express").Router()
const {addproduct, getAllProduct, singleProduct, deleteProductById, Editproduct, Search} = require("../controller/product")
const upload = require("../config/upload")
const productSchema = require("../model/productSchema")
const paginated = require("../config/pagination")

router.get("/", paginated(productSchema, "postedBy", {created: "-1"}), getAllProduct)
router.get("/search",paginated(productSchema, "postedBy", {created: "-1"}), Search )
router.post("/new", upload.array("productImg", 8),addproduct)
router.get("/:slug", singleProduct)
router.delete("/remove/:id", deleteProductById)
router.patch("/edit/:id",  upload.array("productImg", 8), Editproduct)

module.exports = router

