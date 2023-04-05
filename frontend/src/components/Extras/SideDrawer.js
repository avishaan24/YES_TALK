import React, { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import ProfileModal from './ProfileModal';
import { ChatState } from '../../Context/ChatProvider';
import { useHistory } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import axios from 'axios';
import Chatloading from './Chatloading';
import UserItemList from '../UserAvatar/UserItemList';
import { getSender } from '../../config/ChatLogics';
import { MDBBadge, MDBIcon } from 'mdb-react-ui-kit';
import styles from './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
const custom="text-md block px-3 py-2  rounded-lg w-full border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500  focus:border-gray-600 focus:outline-none"


const SideDrawer = () => {
      const {user,setSelectedChat,chats, setChats,notification, setNotification}=ChatState();
      const [search,setSearch]=useState("");
      const [searchResult,setSearchResult]=useState([]);
      const [loading,setLoading]=useState(false);
      const [loadingChat,setLoadingChat]=useState();
      const history=useHistory();
      const [show, setShow] = useState(false);


      const handleClose = () => {
        setShow(false);
        setSearchResult();
        setSearch();
      }
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
          toast.warn("Please enter anything in search", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
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
          toast.error("Failed to load search", {
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
          toast.error("Error to load chat", {
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
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"0px 2vw"}}>
      <button className='d-flex justify-content-between' onClick={handleShow}>
            <i className='fas fa-search style='style={{padding:"4px",color:"#eff1f6"}}/>
            <div className='pr-1' style={{padding:"1px",color:"white"}}>Search User</div>
      </button>
      <h3 style={{fontSize:"2xl",color:"#eff1f6"}}>YES TALK</h3>
      <div style={{display:"flex"}}>
            <Dropdown>
              <Dropdown.Toggle variant="white" style={styles.dropdown}>
                <div style={{display:"flex",margin:"2vh 0px"}}>
                  <div className="bell-icon" style={{display:"flex"}}>
                      <i className="fas fa-bell fa-lg" style={{padding:"1px 1px",color:"#eff1f6"}}></i>
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
                className="rounded-circle" alt="Avatar" style={{padding:"4px 10px",height:"5vh"}}/>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <ProfileModal user={user}>
                  <Dropdown.Item>My Profile</Dropdown.Item>
                </ProfileModal>
                <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Offcanvas show={show} onHide={handleClose} style={{background:"#c6c6ec"}}>
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Search User</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <div className="d-flex p-2">
                <input className={fixedInputClass+custom} type="text" placeholder='Search by name or email' value={search} onChange={(e)=>setSearch(e.target.value)} style={{background:"#f0f0f5"}}/>
                  <i className='fas fa-search fa-xl'style={{padding:"4px",margin:"auto 5px",cursor:"pointer"}} onClick={handleSearch}/>
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
