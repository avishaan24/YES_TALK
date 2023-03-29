import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {useHistory} from "react-router-dom";
import { ChatState } from '../../Context/ChatProvider';

const SignUp = () => {
      const [show,setShow]=useState(false);
      const [name,setName]=useState();
      const [email,setEmail]=useState();
      const [password,setPassword]=useState();
      const [avatar,setAvatar]=useState("");
      const [confirmpassword,setConfirmpassword]=useState();
      const [loading,setLoading]=useState(false);
      const toast=useToast();
      const history=useHistory();
      const {user,setUser}=ChatState();

      const handleClick=()=>{setShow(!show)};

      const postDetails=(pics)=>{
            setLoading(true);
            if(pics===undefined){
                  toast({
                        title:"Please select an image",
                        status:"Warning",
                        duration:5000,
                        isClosable:true,
                        position:"bottom",
                  });
                  return;
            }
            if(pics.type==="image/jpeg"||pics.type==="image/png"){
                  const data=new FormData()
                  data.append("file",pics)
                  data.append("upload_preset","Chatting-app")
                  data.append("cloud_name","dbkrro3sm")
                  fetch("https://api.cloudinary.com/v1_1/dbkrro3sm/image/upload",{
                        method:"post",
                        body:data,
                  }).then((res)=>res.json())
                  .then((data)=>{
                        setAvatar(data.url.toString());
                        setLoading(false);
                  }).catch((err)=>{
                        console.log(err);
                        setLoading(false);
                  })
            }else{
                  toast({
                        title:"Please select an image",
                        status:"Warning",
                        duration:5000,
                        isClosable:true,
                        position:"bottom",
                  });
                  setLoading(false);
                  return;
            }
      }

      const submitHandler=async()=>{
            setLoading(true);
            if(!name|| !email || !password){
                  toast({
                        title:"Please fill all the fields",
                        status:"Warning",
                        duration:5000,
                        isClosable:true,
                        position:"bottom",
                  }); 
                  setLoading(false);
                  return;
            }
            if(password!==confirmpassword){
                  toast({
                        title:"Password doesn't match",
                        status:"Warning",
                        duration:5000,
                        isClosable:true,
                        position:"bottom",
                  });
                  setLoading(false);
                  return;
            }
            try {
                  const config={
                        headers:{
                              "Content-type":"application/json",
                        },
                  };
                  console.log(avatar);
                  const {data}= await axios.post("http://localhost:5000/api/user",{name,email,password,avatar},config);
                  toast({
                        title:"Registration Successfull",
                        status:"success",
                        duration:5000,
                        isClosable:true,
                        position:"bottom",
                  });
                  localStorage.setItem("userInfo",JSON.stringify(data));
                  const userInfo=JSON.parse(localStorage.getItem("userInfo"));
                  setUser(userInfo);
                  setLoading(false);
                  history.push("/chats")
            } catch (error) {
                  toast({
                        title:"Error occurred",
                        description:error.response.data.message,
                        status:"Warning",
                        duration:5000,
                        isClosable:true,
                        position:"bottom",
                  });
                  setLoading(false)
            }
      }
  return (
    <div>
      <div className='text-black' style={{borderRadius: '25px'}}>
            <div >
                  <p className="text-center h5">Sign up</p>
            </div>
            <div className="d-flex flex-row align-items-center mb-4 ">
                  {/* <i fas icon="user me-3" size='lg'/> */}
                  <label htmlFor="fname">Name:</label>
                  <input id='fname' type='text' placeholder="Your Name" onChange={(e)=>setName(e.target.value)} required/>
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i fas icon="envelope me-3" size='lg'/> */}
                  <label htmlFor="email">Email:</label>
                  <input placeholder='Your Email' id='email' type='email' onChange={(e)=>setEmail(e.target.value)} required/>
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i fas icon="lock me-3" size='lg'/> */}
                  <label htmlFor="id">Password:</label>
                  <input placeholder='Password' id='pass' type={show ?'text':'password'} onChange={(e)=>setPassword(e.target.value)} required/>
                  <button onClick={handleClick}>{show ? "Hide":"Show"}</button>
            </div>

            <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i fas icon="key me-3" size='lg'/> */}
                  <label htmlFor="cpass">Confirm Password:</label>
                  <input placeholder='Repeat your password' id='cpass' type='password' onChange={(e)=>setConfirmpassword(e.target.value)} required/>
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i fas icon="key me-3" size='lg'/> */}
                  <label htmlFor="pic">Avatar:</label>
                  <input placeholder='Profile Picture' id='pic' type='file' accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}/>
            </div>
            <div>
                  <button className='btn-primary' onClick={submitHandler}>Register</button>
            </div>
      </div>
    </div>  
  )
}

export default SignUp
