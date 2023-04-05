import axios from 'axios';
import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatState } from '../../Context/ChatProvider';
import UserBadge from '../UserAvatar/UserBadge';
import UserItemList from '../UserAvatar/UserItemList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
const custom="text-md block px-3 py-2  rounded-lg w-full border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500  focus:border-gray-600 focus:outline-none"

const UpdateGroupModal = ({fetchAgain,setFetchAgain}) => {
      const [show, setShow] = useState(false);
      const [groupName,setGroupName]=useState("");
      const [search,setSearch]=useState("");
      const [searchResult,setSearchResult]=useState([]);
      const [selectedUser,setSelectedUser]=useState([]);
      const [loading,setLoading]=useState(false);
      const [renameLoading,setRenameLoading]=useState(false);

      const {user,selectedChat,setSelectedChat}=ChatState();

      const handleRemove=async(user1)=>{
            if(selectedChat.groupAdmin._id!==user._id){
                  toast.error("Only Admin can remove user", {
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
            if(selectedChat.groupAdmin._id===user1._id){
                  toast.error("Admin are not allowed to remove group", {
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
                  toast.error("Enable in removing user", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                      });
                  setLoading(false);  
            } 
      };

      const AddUser=async(useradd)=>{
            if(selectedChat.users.find((u)=>u._id===useradd._id)){
                  toast.error("User already added", {
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

            if(selectedChat.groupAdmin._id!==user._id){
                  toast.error("Only admin can add user", {
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
                  toast.error("Error in adding user", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
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
                  toast.error("Error in renaming group", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
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

      const handleClose = () => {setShow(false); setSearchResult([])};
      const handleShow = () => setShow(true);
  return (
    <>
      <i className="fa fa-eye" aria-hidden="true" onClick={handleShow} style={{cursor:"pointer"}}></i>
      <Modal size="lg" show={show} onHide={handleClose} centered>
        <Modal.Header style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center",background:"#c6c6ec"}}closeButton>
          <Modal.Title style={{display:"flex",flexDirection:"row"}}>
            <img src="https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_1280.png" className="rounded-circle" alt="Avatar" style={{padding:"4px 10px",height:"5vh"}}/>
            {selectedChat.chatName}
            </Modal.Title>
          <h6>GroupAdmin: {selectedChat.groupAdmin.name}</h6>
          {/* <Modal.Title>GroupAdmin:{selectedChat.groupAdmin.name}</Modal.Title> */}
        </Modal.Header>
        <Modal.Body style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center",background:"#c6c6ec"}}>
            <div style={{display:"flex",flexWrap:"wrap",width:"100%",alignContent:"center",alignItems:"center",margin:"auto",justifyContent:"center"}}>
            {selectedChat.users.map((user)=>(<UserBadge key={user._id} user={user} handleFunction={()=>handleRemove(user)}/>))}
            </div>
            <div style={{display:"flex"}}>
            <div className="d-flex flex-row align-items-center mb-4" style={{margin:"1vh"}} >
                  <i style={{margin:"auto 5px"}} class="fa-solid fa-user-tie fa-2x"></i>
                  <input className={fixedInputClass+custom} id='fname' type='text' placeholder="Group Name"  value={groupName} onChange={(e)=>setGroupName(e.target.value)} required/>
                  <button style={{display:'flex',justifyContent:"center",fontWeight:"regular",border:"transparent",color:"white",padding:"10px",background:"blue",borderRadius:"10px",margin:"0px 5px"}} onClick={handleRename}>Update</button>
            </div>
            </div>
            <div style={{width:"75%"}}>
                  {(selectedChat.groupAdmin._id===user._id)? <div className="d-flex flex-row align-items-center" style={{width:"100%",margin:"-15px 0px 0px 0px"}}>
                        <input className={fixedInputClass+custom} id='fname' type='text' placeholder="Add users to the group" onChange={(e)=>handleSearch(e.target.value)} required/>
                  </div>:<></>}
                  {loading?(<div>Loading</div>):(
                  searchResult?.slice(0,4).map((user)=>(<UserItemList 
                  key={user._id}
                  user={user}
                  handleFunction={()=>AddUser(user)}
                  />))
          )}
            </div>
        </Modal.Body>
        <Modal.Footer style={{background:"#c6c6ec"}}>
          <Button variant="danger" onClick={()=>handleRemove(user)}>
            Leave Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UpdateGroupModal
