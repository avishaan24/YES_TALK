const express= require("express");
const connectDb = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes=require("./Routes/userRoutes")
const chatRoutes=require("./Routes/chatRoutes")
const messageRoutes=require("./Routes/messageRoutes")
const cors=require("cors");
const app=express();
connectDb();

app.use(cors());
app.use(express.json());
app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server=app.listen(5000,console.log("server started"));

const io=require("socket.io")(server,{
      pingTimeout:60000,
      cors:{
            origin:"http://localhost:3000",
      },
});

io.on("connection",(socket)=>{
      socket.on("setup",(userData)=>{
            socket.join(userData._id);
            socket.emit("connected");
      });

      socket.on("join chat",(room)=>{
            socket.join(room);
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new message",(newMessageRecieved)=>{
            var chat=newMessageRecieved.chat;
            if(!chat.users)   return;
            chat.users.forEach(user=>{
                  if(user._id==newMessageRecieved.sender._id)     return;
                  socket.in(user._id).emit("message recieved",newMessageRecieved);
            })
      });

      socket.off("setup",()=>{
            socket.leave(userData._id);
      });
})