import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from "axios";
import Chatloading from './Chatloading';
import { getSender,getSenderAll } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyChats = ({ fetchAgain })  => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:5000/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Enable to load Chats", {
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
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <div style={{alignItems:"center",background:"#535379",borderRadius:"20px",padding:"1vw",color:"white",height:"90vh",margin:"0px 10px"}} className={`${selectedChat ? "hidden" : "flex"} w-full sm:flex flex-col sm:w-1/3`}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",fontSize:"2.5vh"}}>
        My Chats
        <GroupChatModal>
          <i class="fa-solid fa-plus" style={{margin:"0px 6px"}}></i>
          <button>New Group Chat</button> 
        </GroupChatModal>
      </div>
      <div style={{display:"flex",flexDirection:"column",width:"100%",height:"100%",background:"#8585ad",overflowY:"hidden",borderRadius:"10px",padding:"10px"}}>
      {chats ? (
          <div style={{overflowY:"scroll"}}>
            {chats.map((chat) => (
              <div onClick={() => {setSelectedChat(chat);}} style={{cursor:"pointer",background:`${selectedChat && selectedChat._id===chat._id?"#b3ffb3":"#c2c2d6"}`,width:"100%",display:"flex",alignItems:"center",color:"black",padding:"6px 2px",borderRadius:"15px",margin:"0.3vh 2px"}} key={chat._id}>
                {(chat.isGroupChat)?<img src="https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png" className="rounded-circle" alt="Avatar" style={{padding:"4px 10px",height:"5vh"}}/>:<img src={getSenderAll(user,chat.users).avatar} className="rounded-circle" alt="Avatar" style={{padding:"4px 10px",height:"5vh"}}/>}
                <div>
                  <div style={{fontSize:"18px"}}>
                    {(chat.isGroupChat)
                      ? chat.chatName
                      : getSender(user, chat.users)}
                  </div>
                  {chat.latestMessage && (
                    <div style={{fontSize:"10px"}}>
                      <b>{(chat.latestMessage.sender.name===user.name)?"You":chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Chatloading />
        )}
      </div>
    </div>
  )
}

export default MyChats
