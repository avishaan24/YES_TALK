import React from 'react'
import { useState } from 'react'
import ChatBox from '../components/Extras/ChatBox'
import MyChats from '../components/Extras/MyChats'
import SideDrawer from '../components/Extras/SideDrawer'
import { ChatState } from '../Context/ChatProvider'
import "../styles/style.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Chatpage = () => {
  const {user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);
  return (
    <div className='chat_large'>
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
