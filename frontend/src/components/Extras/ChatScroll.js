import React from 'react';
import ScrollableFeed from "react-scrollable-feed";
import {isSame,isLast,isSameSenderMargin,isSameSender} from "../../config/ChatLogics";
import { ChatState } from '../../Context/ChatProvider';

const ChatScroll = ({message}) => {
  const {user}=ChatState();
  return (
    <ScrollableFeed>
      {message && message.map((m,i)=>(
            <div style={{display:"flex"}} key={m._id}>
              {(isSame(message,m,i,user._id)||isLast(message,i,user._id))
              &&(
                <img src={m.sender.avatar} className="rounded-circle" height={38} alt="Avatar" style={{padding:"4px 8px"}}/>
              )}
              <span style={{
                backgroundColor:`${m.sender._id===user._id?"#BEE3F8":"#B9F5D0"}`,borderRadius:"20px",padding:"5px 15px",maxWidth:"75%",
                marginLeft:isSameSenderMargin(message,m,i,user._id),
                marginTop:isSameSender(message,m,i)?3:10
                }}>{m.content}</span>
            </div>
      ))}
    </ScrollableFeed>
  )
}

export default ChatScroll
