import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useToast} from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserItemList from '../UserAvatar/UserItemList';
import UserBadge from '../UserAvatar/UserBadge';

const GroupChatModal = ({children}) => {
      const [show, setShow] = useState(false);
      const [groupName,setGroupName]=useState();
      const [search,setSearch]=useState("");
      const [searchResult,setSearchResult]=useState([]);
      const [selectedUser,setSelectedUser]=useState([]);
      const [loading,setLoading]=useState(false);

      const toast=useToast();
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

      const handleSubmit=async()=>{
        if(!groupName||!selectedUser){
          toast({
            title:"Please fill all the fields",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
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
          toast({
            title:"Error in creating group",
            status:"Error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
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
          toast({
            title:"User already added",
            status:"Warning",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
          });  
          return;
        }
        setSelectedUser([...selectedUser,userToAdd])
      };
  return (
    <>
      <span onClick={handleShow}>{children}</span>
      <Modal size="small" show={show} onHide={handleClose} centered>
        <Modal.Header style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between"}}>
          <input type="text" placeholder='Group Name' onChange={(e)=>setGroupName(e.target.value)} />
          <input type="text" placeholder='Add users to add to group e.g: Avinash' onChange={(e)=>handleSearch(e.target.value)} />
          <div style={{display:"flex",flexWrap:"wrap",width:"100%"}}>
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
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal> 
    </>
  )
}

export default GroupChatModal
