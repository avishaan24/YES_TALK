import { useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from "axios";
import Chatloading from './Chatloading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain })  => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

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
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"31%",background:"white",borderRadius:"20px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
        My Chats
        <GroupChatModal>
          <button>New Group Chat</button> 
        </GroupChatModal>
      </div>
      <div style={{display:"flex",flexDirection:"column",padding:"3px",width:"100%",height:"100%",background:"#F8F8F8",overflowY:"hidden"}}>
      {chats ? (
          <div style={{overflowY:"scroll"}}>
            {chats.map((chat) => (
              <div onClick={() => {setSelectedChat(chat);}} style={{cursor:"pointer",background:`${selectedChat && selectedChat._id===chat._id?"#b3ffb3":"#d6d6c2"}`,color:"black",padding:"3px 2px",borderRadius:"15px",margin:"3px 2px"}} key={chat._id}>
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
