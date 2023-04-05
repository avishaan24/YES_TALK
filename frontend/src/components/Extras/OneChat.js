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
import animationData from "../../Design_&_Animations/132124-hands-typing-on-keyboard.json"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

      const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
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
          toast.error("Error while fetching message", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
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
            toast.error("Error in sending message", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
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
            <div style={{width:"96%",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"30px",background:"#535379",margin:"5px 20px",color:"white"}}>
            {(!selectedChat.isGroupChat ? (
                <>
                <div onClick={()=>setSelectedChat()} className="flex sm:hidden">
                  <i class="fa-solid fa-arrow-left"></i>
                </div>
                <div style={{display:"flex",flexDirection:"row"}}>
                  {getSender(user,selectedChat.users)}
                  <div>
                    {istyping?(<div style={{margin:"1.5vh 1.5vw"}}>
                      <Lottie animationData={animationData} loop={true} style={{width:"100%",height:"3vh"}}/>
                    </div>):(<></>)}
                  </div>
                </div>
                <ProfileModal user={getSenderAll(user,selectedChat.users)}/>
                </>
              ) : (
                <>
                <div onClick={()=>setSelectedChat()} className="flex sm:hidden">
                  <i class="fa-solid fa-arrow-left"></i>
                </div>
                <div style={{display:"flex",flexDirection:"row"}}>
                  {selectedChat.chatName.toUpperCase()}
                  <div>
                    {istyping?(<div style={{margin:"1.5vh 1.5vw"}}>
                      <Lottie animationData={animationData} loop={true} style={{width:"100%",height:"3vh"}}/>
                    </div>):(<></>)}
                  </div>
                </div>
                  <UpdateGroupModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                </>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",background:"#7575a3",width:"96%",height:"100%",borderRadius:"10px",overflowY:"hidden",margin:"8px"}}>
              {loading?(
                <>Loading</>
              ):(
                <>
                  <div style={{display:"flex",flexDirection:"column",overflowY:"scroll",scrollbarWidth:"none",padding:"10px"}}>
                    <ChatScroll message={message}/>
                  </div>
                </>
              )}
            </div>
            {/* <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",background:"#c2c2d6",width:"96%",borderRadius:"10px",overflowY:"hidden",paddingTop:"10px"}}> */}
              <input type="text" placeholder="Enter a message" onChange={typingHandler}  onKeyDown={sendMessage} style={{background:"#3d3d5c",borderRadius:"10px",width:"96%",height:"6vh",color:"white",padding:"0px 1.2vw"}} value={newMessage} required/>
            {/* </div> */}
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
