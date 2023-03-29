const asyncHandler=require("express-async-handler");
const Chat = require("../Models/ChatModels");
const User = require("../Models/UserModel");

const accessChat=asyncHandler(async(req,res)=>{
      const {userId}=req.body;
      if(!userId){
            console.log("UserId not sent with request");
            return res.sendStatus(400);
      }
      var isChat=await Chat.find({
            isGroupChat:false,
            $and:[
                  {users:{$elemMatch:{$eq:req.user._id}}},
                  {users:{$elemMatch:{$eq:userId}}},
            ]
      }).populate("users","-password").populate("latestMessage");

      isChat=await User.populate(isChat,{
            path:"latestMessage.sender",
            select:"name email avatar",
      });
      if(isChat.length>0){
            res.send(isChat[0]);
      }else{
            var charData={
                  chatName:"sender",
                  isGroupChat:false,
                  users:[req.user._id,userId],
            };
            try {
                 const createChat=await Chat.create(charData);
                 const fullChat=await Chat.findOne({_id:createChat._id}).populate("users","-password");
                 res.status(200).send(fullChat);
            } catch (error) {
                  res.status(400);
                  throw new Error(error.message);
            }
      }
});

const fetchChat = asyncHandler(async (req, res) => {
      try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
          .populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 })
          .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name avatar email",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

const createGroupChat=asyncHandler(async(req,res)=>{
      if(!req.body.name|| !req.body.users){
            return res.status(400).send({message:"please fill all the fields"});
      }
      var users=JSON.parse(req.body.users);
      if(users.length<2){
            return res.status(400).send("A group have must be more than 2 users");
      }

      users.push(req.user);
      try {
            const createGroup=await Chat.create({
                  chatName:req.body.name,
                  users:users,
                  isGroupChat:true,
                  groupAdmin:req.user,
            });
            const fullGroupChat=await Chat.find({_id:createGroup._id}).populate("users","-password").populate("groupAdmin","-password");
            res.status(200).json(fullGroupChat);
      } catch (error) {
            res.status(400);
            throw new Error(error.message);    
      }
});

const renameGroupChat=asyncHandler(async(req,res)=>{
      const {chatId,chatName}=req.body
      
      const updateChat=await Chat.findByIdAndUpdate(chatId,{chatName},{new:true}).populate("users","-password").populate("groupAdmin","-password");
      if(!updateChat){
            res.status(400);
            throw new Error("Chat not found");
      }else{
            res.json(updateChat);
      }
});

const addUserToGroup=asyncHandler(async(req,res)=>{
      const {chatId,userId}=req.body
      const add=await Chat.findByIdAndUpdate(chatId,{$push:{users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password");
      if(!add){
            res.status(404);
            throw new Error("Chat not found");
      }else{
            res.json(add);
      }
});

const removeUserFromGroup=asyncHandler(async(req,res)=>{
      const {chatId,userId}=req.body
      const remove=await Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password");
      if(!remove){
            res.status(404);
            throw new Error("Chat not found");
      }else{
            res.json(remove);
      }
});

module.exports={accessChat,fetchChat,createGroupChat,renameGroupChat,addUserToGroup,removeUserFromGroup};