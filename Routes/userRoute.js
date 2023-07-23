const express = require('express');
const UserModel = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DogsModel = require('../Model/DogModel');
const BlockModel = require('../Model/BlockModel');
const { userAuth } = require('../Middlewares/user.auth');

const userRoute = express.Router()


userRoute.post("/register", async(req,res)=>{


    try {

        const {email, password} = req.body

        const userExsist = await UserModel.findOne({email:email})

        if(userExsist){
            return res.status(400).json({error:"User Already Registered"})
        }

        const blacklisted =  await BlockModel.findOne({email:email})

        if(blacklisted){
            return res.status(405).json({error:"User is BlockListed"})
        }

        if(!/[A-Z]/.test(password)||!/[1-9]/.test(password)||!/[!@#$%^&*_?":]/.test(password)||password.length<8){
            return res.status(401).json({error:"Password must have One uppercase, One number, and One Special Character"})
        }

        const user = UserModel(req.body)

        bcrypt.hash(password, 10, async function(err, hash) {
            
            user.password = hash

            await user.save()

            res.json({message:"User Successfully Registered", user:user})

        });
        
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }

})


userRoute.post("/login", async(req,res)=>{

    try {

        const {email, password} = req.body

        const user = await UserModel.findOne({email:email})

        if(!user){
            return res.status(402).json({error:"User Does Not Exist"})
        }

        bcrypt.compare(password, user.password, function(err, result) {
            
            if(!result){
                return res.status(403).json({error:"Invalid Password"})
            }

            const token = jwt.sign({ userID : user._id, userName : user.name ,userLocation:user.location}, "1234")

            res.json({message:"User Successfully Logged In", token:token, userName:user.name})

        });
        
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }

})


userRoute.patch("/patch",userAuth, async(req,res)=>{
    try {

        const { userID } = req.body;

        const {name,location,email,gender} = req.body

        const obj = {
            name:name,
            location:location,
            email:email,
            gender:gender
        }

        const users = await UserModel.findByIdAndUpdate(userID,obj )

        res.json({users:users, message:"Account Details Updated"})
        
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
})




module.exports = userRoute