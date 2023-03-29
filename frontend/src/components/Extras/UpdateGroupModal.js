import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatState } from '../../Context/ChatProvider';
import UserBadge from '../UserAvatar/UserBadge';
import UserItemList from '../UserAvatar/UserItemList';

const UpdateGroupModal = ({fetchAgain,setFetchAgain}) => {
      const [show, setShow] = useState(false);
      const [groupName,setGroupName]=useState("");
      const [search,setSearch]=useState("");
      const [searchResult,setSearchResult]=useState([]);
      const [selectedUser,setSelectedUser]=useState([]);
      const [loading,setLoading]=useState(false);
      const [renameLoading,setRenameLoading]=useState(false);

      const toast=useToast();

      const {user,selectedChat,setSelectedChat}=ChatState();

      const handleRemove=async(user1)=>{
            if(selectedChat.groupAdmin._id!==user._id&&user1._id!==user._id){
                  toast({
                        title:"Only Admin can remove user",
                        status:"Error",
                        duration:5000,
                        isClosable:true,
                        position:"bottom-left",
                  }); 
                  return;   
            }
            if(selectedChat.groupAdmin._id===user1._id){
                  toast({
                        title:"Admin are not allowed to remove group",
                        status:"Error",
                        duration:5000,
                        isClosable:true,
                        position:"bottom-left",
                  }); 
                  return;    
            }
            try{
                  setLoading(true);
                  const config={
                        headers:{
                          Authorization:`Bearer ${user.token}`
                        }
                  };   

                  const {data}= await axios.put("http://localhost:5000/api/chat/removeuser",{
                        chatId:selectedChat._id,
                        userId:user1._id,
                  },config)

                  user1._id===user._id?setSelectedChat():setSelectedChat(data);
                  setFetchAgain(!fetchAgain);
                  setLoading(false);
            }catch(error){
                  toast({
                        title:"Error in removing the user",
                        status:"Error",
                        duration:5000,
                        isClosable:true,
                        position:"bottom-left",
                  });  
                  setLoading(false);  
            } 
      };

      const AddUser=async(useradd)=>{
            if(selectedChat.users.find((u)=>u._id===useradd._id)){
                  toast({
                        title:"User Already added",
                        status:"Error",
                        duration:5000,
                        isClosable:true,
                        position:"bottom-left",
                  }); 
                  return; 
            }

            if(selectedChat.groupAdmin._id!==user._id){
                  toast({
                        title:"Only admin can add user",
                        status:"Error",
                        duration:5000,
                        isClosable:true,
                        position:"bottom-left",
                  }); 
                  return;   
            }
            try{
                  setLoading(true);
                  const config={
                        headers:{
                          Authorization:`Bearer ${user.token}`
                        }
                  };   

                  const {data}= await axios.put("http://localhost:5000/api/chat/adduser",{
                        chatId:selectedChat._id,
                        userId:useradd._id,
                  },config)
                  setSelectedChat(data);
                  setFetchAgain(!fetchAgain);
                  setLoading(false);
            }catch(error){
                  toast({
                        title:"Error in adding the user",
                        status:"Error",
                        duration:5000,
                        isClosable:true,
                        position:"bottom-left",
                  });  
                  setLoading(false);  
            }
      };

      const handleRename=async()=>{
            if(!groupName) return;

            try {
                setRenameLoading(true);
                const config={
                  headers:{
                    Authorization:`Bearer ${user.token}`
                  }
                };
                
                const {data}=await axios.put("http://localhost:5000/api/chat/rename",{
                  chatId:selectedChat._id,
                  chatName:groupName,
                },config)

                setSelectedChat(data);
                setFetchAgain(!fetchAgain);
                setRenameLoading(false);
            } catch (error) {
                  toast({
                        title:"Error in renaming the group",
                        status:"Error",
                        duration:5000,
                        isClosable:true,
                        position:"bottom-left",
                  });  
                  setRenameLoading(false);  
            }

            setGroupName("");
      };

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

      const handleClose = () => {setShow(false); setSearchResult([])};
      const handleShow = () => setShow(true);
  return (
    <>
      <i className="fa fa-eye" aria-hidden="true" onClick={handleShow} style={{cursor:"pointer"}}></i>
      <Modal size="lg" show={show} onHide={handleClose} centered>
        <Modal.Header style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}closeButton>
          <Modal.Title>{selectedChat.chatName}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",flexWrap:"wrap",width:"100%"}}>
            {selectedChat.users.map((user)=>(<UserBadge key={user._id} user={user} handleFunction={()=>handleRemove(user)}/>))}
            </div>
            <div style={{display:"flex"}}>
                  <input type="text" placeholder='Group name' value={groupName} onChange={(e)=>setGroupName(e.target.value)}/>
                  <Button variant='primary' onClick={handleRename}>Update</Button>
            </div>
            <div>
                  <input type="text" placeholder='Add users to the group' onChange={(e)=>handleSearch(e.target.value)} />
                  {loading?(<div>Loading</div>):(
                  searchResult?.slice(0,4).map((user)=>(<UserItemList 
                  key={user._id}
                  user={user}
                  handleFunction={()=>AddUser(user)}
                  />))
          )}
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={()=>handleRemove(user)}>
            Leave Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UpdateGroupModal
