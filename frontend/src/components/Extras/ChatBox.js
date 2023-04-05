import React from 'react'
import { ChatState } from '../../Context/ChatProvider';
import OneChat from './OneChat';

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat}=ChatState();
  return (
    <div style={{alignItems:"center",background:"#535379",padding:"2px",borderRadius:"20px",height:"90vh"}} className={`${selectedChat ? "flex" : "hidden"} w-full sm:flex flex-col sm:w-2/3`}>
      <OneChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  )
}

export default ChatBox
