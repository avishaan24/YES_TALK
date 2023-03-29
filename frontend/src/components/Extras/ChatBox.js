import React from 'react'
import { ChatState } from '../../Context/ChatProvider';
import OneChat from './OneChat';

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat}=ChatState();
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",background:"white",width:"68%",padding:"2px",borderRadius:"40px",height:"90vh"}}>
      <OneChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  )
}

export default ChatBox
