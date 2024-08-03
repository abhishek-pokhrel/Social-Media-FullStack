const express=require("express")
const { registerController, loginController,
     logoutController, refetchUserController, searchUserController } = require("../controllers/authController")
const router=express.Router()


//Register Middleware
router.post("/register", registerController)

//Login Middleware
router.post("/login",loginController)


//Logout Middleware
router.get("/logout",logoutController)


//Current User Middleware
router.get("/refetch",refetchUserController)

//Search User Middleware
router.post("/search",searchUserController)


module.exports=router