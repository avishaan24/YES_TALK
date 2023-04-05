const asyncHandler=require("express-async-handler");
const generateToken = require("../config/generateToken");
const User=require("../Models/UserModel")

const registerUser= asyncHandler(async(req,res)=>{
      const {name,email,password,avatar}=req.body;

      if(!name || !email || !password){
            res.status(400);
            throw new Error("Please enter all the fields");
      }

      const userExits=await User.findOne({email});

      if(userExits){
            res.status(400);
            throw new Error("User already exists");
      }
      let user

      if(avatar==='')
       user=await User.create({
            name,email,password
      });
      else
      user=await User.create({
            name,email,password,avatar
      });
 
      if(user){
            res.status(201).json({
                  _id:user._id,
                  name:user.name,
                  email:user.email,
                  avatar:user.avatar,
                  token:generateToken(user._id)
            })
      }else{
            res.status(400);
            throw new Error("User Creation failed");
      }
});

const authUser=asyncHandler(async(req,res)=>{
      const {email,password}=req.body;

      const user=await User.findOne({email});

      if(user && (await user.checkpassword(password))){
            res.status(201).json({
                  _id:user._id,
                  name:user.name,
                  email:user.email,
                  avatar:user.avatar,
                  token:generateToken(user._id)
            });
      }else{
            res.status(400);
            throw new Error("Email or Password is incorrect");
      }
});

const allUsers=asyncHandler(async(req,res)=>{
      const keyword=req.query.search
      ?{
            $or:[
                  {name:{$regex: req.query.search, $options:"i"}},
                  {email:{$regex: req.query.search, $options:"i"}},
            ]
      }:{};
      const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
      res.send(users);
});

module.exports={registerUser,authUser,allUsers};