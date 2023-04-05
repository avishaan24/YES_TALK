import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useToast} from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserItemList from '../UserAvatar/UserItemList';
import UserBadge from '../UserAvatar/UserBadge';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
const custom="text-md block px-3 py-2  rounded-lg w-full border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500  focus:border-gray-600 focus:outline-none"

const GroupChatModal = ({children}) => {
      const [show, setShow] = useState(false);
      const [groupName,setGroupName]=useState();
      const [search,setSearch]=useState("");
      const [searchResult,setSearchResult]=useState([]);
      const [selectedUser,setSelectedUser]=useState([]);
      const [loading,setLoading]=useState(false);
      const {user,chats,setChats}=ChatState();
      const handleClose = () => {
        setShow(false);
        setSearch("");
        setSelectedUser([]);
        setSearchResult([]);
      }
      const handleShow = () => setShow(true);

      const handleSearch=async(query)=>{
        if(!query)
          return;
        setSearch(query);
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
          toast.error("Enable to load search", {
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

      const handleSubmit=async()=>{
        if(!groupName||!selectedUser){
          toast.warn("Please fill all the fields", {
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
          const {data}=await axios.post("http://localhost:5000/api/chat/group",{
            name:groupName,
            isGroupChat:true,
            users:JSON.stringify(selectedUser.map((u)=>u._id)),
          },config);
          setChats([data[0],...chats]);
          handleClose();
        } catch (error) {
          toast.error("Enable in creating Group", {
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

      const handleDelete=async(delUser)=>{
        setSelectedUser(selectedUser.filter((select)=>select._id!==delUser._id));
      };

      const handleGroup=(userToAdd)=>{
        var present=selectedUser.some((elem)=>{
          return JSON.stringify(userToAdd._id)===JSON.stringify(elem._id);
        });
        if(present){
          toast.warn("User already added", {
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
        setSelectedUser([...selectedUser,userToAdd])
      };
  return (
    <>
      <span onClick={handleShow}>{children}</span>
      <Modal size="small" show={show} onHide={handleClose} centered>
        <Modal.Header style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center",background:"#c6c6ec"}}closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",background:"#c6c6ec"}}>
            <div className="d-flex flex-row align-items-center mb-4" >
                  <i style={{margin:"auto 5px"}} class="fa-solid fa-user-tie fa-2x"></i>
                  <input className={fixedInputClass+custom} id='fname' type='text' placeholder="Group Name" onChange={(e)=>setGroupName(e.target.value)} required/>
            </div>
            <div className="d-flex flex-row align-items-center mb-4" style={{width:"100%"}}>
                  <input className={fixedInputClass+custom} id='fname' type='text' placeholder="Add  users to the group e.g: Avinash" onChange={(e)=>handleSearch(e.target.value)} required/>
            </div>
          <div style={{display:"flex",flexWrap:"wrap",width:"100%"}}>
            {(selectedUser.length>0)?<img src="https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png" className="rounded-circle" alt="Avatar" style={{padding:"4px 10px",height:"5vh"}}/>:<></>}
            {selectedUser.map((user)=>(<UserBadge key={user._id} user={user} handleFunction={()=>handleDelete(user)}/>))}
          </div>
          {loading?(<div>Loading</div>):(
            searchResult?.slice(0,4).map((user)=>(<UserItemList 
            key={user._id}
            user={user}
            handleFunction={()=>handleGroup(user)}
            />))
          )}
        </Modal.Body>
        <Modal.Footer style={{background:"#c6c6ec"}}>
          <Button variant="primary" onClick={handleSubmit}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal> 
    </>
  )
}

export default GroupChatModal
