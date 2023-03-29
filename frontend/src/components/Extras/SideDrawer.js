import React, { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import ProfileModal from './ProfileModal';
import { ChatState } from '../../Context/ChatProvider';
import { useHistory } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import Chatloading from './Chatloading';
import UserItemList from '../UserAvatar/UserItemList';
import { getSender } from '../../config/ChatLogics';
import { MDBBadge, MDBIcon } from 'mdb-react-ui-kit';
import styles from './style.css';

const SideDrawer = () => {
      const {user,setSelectedChat,chats, setChats,notification, setNotification}=ChatState();
      const [search,setSearch]=useState("");
      const [searchResult,setSearchResult]=useState([]);
      const [loading,setLoading]=useState(false);
      const [loadingChat,setLoadingChat]=useState();
      const history=useHistory();
      const toast=useToast();
      const [show, setShow] = useState(false);


      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      const logoutHandler=()=>{
        localStorage.removeItem("userInfo");
        setSelectedChat();
        if(!localStorage.getItem("userInfo")){
          history.push("/"); 
        }
      }

      const handleSearch=async()=>{
        if(!search){
          toast({
            title: "Please enter anything in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
        }
        try {
          setLoading(true);
          const config={
            headers:{
              Authorization:`Bearer ${user.token}`
            }
          };
          const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title:"Error occurred",
            description:"Failed to load search",
            status:"Error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
          });
        }
      };

      const accessChat=async(userId)=>{
        try {
          setLoadingChat(true);
          const config={
            headers:{
              "Content-type":"application/json",
              Authorization:`Bearer ${user.token}`
            }
          };
          const {data}=await axios.post("http://localhost:5000/api/chat",{userId},config);
          if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats])
          setSelectedChat(data);
          setLoadingChat(false);
          handleClose();
        } catch (error) {
          toast({
            title:"Error to load chat",
            description:error.message,
            status:"Error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
          });
        }
      };
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
      <button className='d-flex justify-content-between' onClick={handleShow}>
            <i className='fas fa-search'style={{padding:"4px"}}/>
            <div className='pr-1' style={{padding:"1px"}}>Search User</div>
      </button>
      <div style={{fontSize:"2xl"}}>FriendShip</div>
      <div style={{display:"flex"}}>
            <Dropdown>
              <Dropdown.Toggle variant="white" style={styles.dropdown}>
                <div style={{display:"flex",margin:"5px 0px"}}>
                  <div className="bell-icon" style={{display:"flex"}}>
                      <i className="fas fa-bell fa-lg" style={{padding:"1px 1px"}}></i>
                  </div>
                  {notification.length>0 && (
                      <MDBBadge color='danger' style={{fontSize:"0.6rem"}} notification pill>{notification.length}</MDBBadge>
                    )}
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {!notification.length && "No new message"}
                {notification.map((newNotif,index)=>{
                    return <Dropdown.Item key={newNotif._id} onClick={()=>{
                      setSelectedChat(newNotif.chat);
                      setNotification(notification.filter((n)=>n!==newNotif));}}>
                      {newNotif.chat.isGroupChat
                      ? `New Message in ${newNotif.chat.chatName}`
                      : `New Message from ${getSender(user, newNotif.chat.users)}`}
                      </Dropdown.Item>
                })} 
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle variant="white" id="dropdown-basic" style={styles.dropdown}>
              <img
                src={user.avatar}
                className="rounded-circle" height={35} alt="Avatar" style={{padding:"4px 10px"}}/>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <ProfileModal user={user}>
                  <Dropdown.Item>My Profile</Dropdown.Item>
                </ProfileModal>
                <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Search User</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div className="d-flex p-2">
                  <input type="text" placeholder='Search by name or email' value={search} onChange={(e)=>setSearch(e.target.value)} />
                  <button 
                  onClick={handleSearch}
                  >Go</button>
                </div>
                  {loading ? (<Chatloading />
                ) : (
                  searchResult?.map((user) => (
                    <UserItemList
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                )}
              </Offcanvas.Body>
            </Offcanvas>
      </div>
    </div>
  )
}

export default SideDrawer
