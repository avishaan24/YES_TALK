import React from 'react'
import { useState } from 'react'
import ChatBox from '../components/Extras/ChatBox'
import MyChats from '../components/Extras/MyChats'
import SideDrawer from '../components/Extras/SideDrawer'
import { ChatState } from '../Context/ChatProvider'


const Chatpage = () => {
  const {user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);
  return (
    <div style={{width:"100%",background:"cyan",height:"100vh"}}>
      {user && <SideDrawer/>}
      <div className="d-flex justify-content-between" style={{margin:"3px",padding:"2px"}}>
      {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
      </div>
    </div>
  )
}

export default Chatpage
