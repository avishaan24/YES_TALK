import React,{useEffect, useState} from 'react'
import { ChatState } from '../../Context/ChatProvider';
import {getSender, getSenderAll} from "../../config/ChatLogics"
import ProfileModal from "./ProfileModal";
import axios from 'axios';
import UpdateGroupModal from './UpdateGroupModal';
import {useToast} from "@chakra-ui/react"
import ChatScroll from './ChatScroll';
import io from "socket.io-client";
import Lottie from "lottie-react";
import animationTyping from "../../Design_&_Animations/typing.json"

const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare; 

const OneChat = ({fetchAgain,setFetchAgain}) => {
      const {user,selectedChat,setSelectedChat,notification, setNotification}=ChatState();
      const [socketConnected,setSocketConnected]=useState(false);
      const [message,setMessage]=useState([]);
      const [loading,setLoading]=useState(false);
      const [newMessage,setNewMessage]=useState("");
      const [typing, setTyping] = useState(false);
      const [istyping, setIsTyping] = useState(false);
      const toast=useToast();

      const defaultOption={
        loop:true,
        autoplay:true,
        animationData:{animationTyping},
        rendererSettings:{
          preserveAspectRatio:"xMidYMid slice"
        }
      }

      const fetchMessage=async()=>{
        if(!selectedChat) return;
        try {
          const config={
            headers:{
              Authorization:`Bearer ${user.token}`,
            },
          };
          setLoading(false);
          const {data}=await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,config);
          setMessage(data);
          setLoading(false);
          socket.emit('join chat',selectedChat._id);
        } catch (error) {
          toast({
            title: "Error while fetching message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };

      const sendMessage=async(event)=>{
        if(event.key==="Enter"&&newMessage){
          socket.emit("stop typing", selectedChat._id);
          try {
            const config={
              headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            const {data}=await axios.post("http://localhost:5000/api/message",{
              content:newMessage,
              chatId:selectedChat._id
            },config)
            setFetchAgain(!fetchAgain);
            socket.emit("new message",data);
            setMessage([...message,data]);
          } catch (error) {
            toast({
              title: "Error while sending message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }
        }
      };

      useEffect(()=>{
        socket=io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
      },[]);

      useEffect(()=>{
        fetchMessage();
        selectedChatCompare=selectedChat
      },[selectedChat]);

      useEffect(()=>{
        socket.on("message recieved", (newMessageRecieved) => {
          if(!selectedChatCompare||selectedChatCompare._id!==newMessageRecieved.chat._id){
            // Notification
            if(!notification.includes(newMessageRecieved)){
              setNotification(notification.filter((n)=>n.chat._id!==newMessageRecieved.chat._id));
              setNotification([newMessageRecieved,...notification]);
              setFetchAgain(!fetchAgain);
            }
          }else{
            setMessage([...message,newMessageRecieved]);
          }
        })
      });
 
      const typingHandler = (e) => {
        setNewMessage(e.target.value);
    
        if (!socketConnected) return;
    
        if (!typing) {
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;
          if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", selectedChat._id);
            setTyping(false);
          }
        }, timerLength);
      };

  return (
    <>
    {selectedChat?(
      <>
            <div style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"30px"}}>
            {(!selectedChat.isGroupChat ? (
                <>
                {getSender(user,selectedChat.users)}
                <ProfileModal user={getSenderAll(user,selectedChat.users)}/>
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                </>
              ))}
            </div>
            <div>
            {istyping?(<div>
              Hello
              <Lottie
              options={defaultOption}
              width={70}
              />
            </div>):(<></>)}
            </div>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",background:"#E8E8E8",width:"100%",height:"100%",borderRadius:"lg",overflowY:"hidden"}}>
              {loading?(
                <>Loading</>
              ):(
                <>
                  <div style={{display:"flex",flexDirection:"column",overflowY:"scroll",scrollbarWidth:"none"}}>
                    <ChatScroll message={message}/>
                  </div>
                </>
              )}
            </div>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",background:"#E8E8E8",width:"100%",borderRadius:"lg",overflowY:"hidden",paddingTop:"10px"}} onKeyDown={sendMessage}>
              <input type="text" placeholder="Enter a message" onChange={typingHandler} style={{background:"#E0E0E0",borderColor:"blue"}} value={newMessage} required/>
            </div>
      </>
    ):(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%"}}>
            <div style={{fontSize:"3xl"}}>Click on user to start messaging with them</div>
      </div>
    )};
    </>
  )
}

export default OneChat
