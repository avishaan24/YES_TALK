const asyncHandler=require("express-async-handler");
const Chat = require("../Models/ChatModels");
const Message=require("../Models/messageModel");
const User = require("../Models/UserModel");

const sendMessage=asyncHandler(async(req,res)=>{
      const {content,chatId}=req.body;
      if(!content||!chatId){
            console.log("Invalid data passed");
            return res.sendStatus(400);
      }

      var newMessage={
            sender:req.user._id,
            content:content,
            chat:chatId,
      };

      try {
            var message=await Message.create(newMessage); 
            message=await message.populate("sender","name avatar")
            message=await message.populate("chat")
            message=await User.populate(message,{
                  path:"chat.users",
                  select:"name avatar email",
            });

            await Chat.findByIdAndUpdate(req.body.chatId,{
                  latestMessage:message
            });
            res.json(message);

      } catch (error) {
            res.status(400);
            throw new Error(error.message);
      }
});

const allMessage=asyncHandler(async(req,res)=>{
      try {
            const message=await Message.find({chat:req.params.chatId})
            .populate("sender","name email avatar").populate("chat");
            res.json(message);
      } catch (error) {
            res.sendStatus(400);
            throw new Error(error.message);
      }
});

module.exports={sendMessage,allMessage};

