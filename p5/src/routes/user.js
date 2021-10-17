const express = require("express")
const { Signup, getUser, Deleteuser, updateUser, Signin, UserVerification } = require("../controller/user")
const router = express.Router()

router.post("/Signup", Signup)
router.post("/Signin", Signin)
router.get("/getUser", getUser)
router.delete("/Deleteuser/:id", Deleteuser)
router.patch("/updateUser/:id", updateUser)
router.get("/UserVerification/:token", UserVerification)

module.exports = router