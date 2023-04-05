import React, { useState } from 'react'
import axios from "axios";
import {useHistory} from "react-router-dom";
import { ChatState } from '../../Context/ChatProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../styles/style.css"


const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
const custom="text-md block px-3 py-2  rounded-lg w-full border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500  focus:border-gray-600 focus:outline-none"

const SignUp = () => {
      const [show,setShow]=useState(false);
      const [confirmShow,setConfirmShow]=useState(false);
      const [name,setName]=useState();
      const [email,setEmail]=useState();
      const [password,setPassword]=useState();
      const [avatar,setAvatar]=useState("");
      const [confirmpassword,setConfirmpassword]=useState();
      const [loading,setLoading]=useState(false);
      const history=useHistory();
      const {user,setUser}=ChatState();

      const handleClick=()=>{setShow(!show)};
      const handleClickConfirm=()=>{setConfirmShow(!confirmShow)};

      const postDetails=(pics)=>{
            setLoading(true);
            if(pics===undefined){
                  toast.warn("Please select an image", {
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
                  toast.warn("Please select an image", {
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
                  return;
            }
      }

      const submitHandler=async()=>{
            setLoading(true);
            if(!name|| !email || !password){
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
                  setLoading(false);
                  return;
            }
            if(password!==confirmpassword){
                  toast.warn("Password doesn't match", {
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
                  return;
            }
            try {
                  const config={
                        headers:{
                              "content-type":"application/json",
                        },
                  };
                  console.log(avatar);
                  const {data}= await axios.post("http://localhost:5000/api/user",{name,email,password,avatar});
                  toast.success("Registration Successfull", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                  });
                  localStorage.setItem("userInfo",JSON.stringify(data));
                  const userInfo=JSON.parse(localStorage.getItem("userInfo"));
                  setUser(userInfo);
                  setLoading(false);
                  history.push("/chats")
            } catch (error) {
                  toast.error("Error while registering user", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                  });
                  setLoading(false)
                  console.log(error)
            }
      }
  return (
    <div>
      <div className='text-black' style={{padding:"0px 10px 5px 10px"}}>
            <div className="d-flex flex-row align-items-center mb-4 ">
                  <i style={{margin:"auto 5px"}} class="fa-solid fa-user-tie fa-2x"></i>
                  <input className={fixedInputClass+custom} id='fname' type='text' placeholder="Your Name" onChange={(e)=>setName(e.target.value)} required/>
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
                  <i  style={{margin:"auto 5px"}} class="fa-solid fa-envelope fa-2x"></i>
                  <input className={fixedInputClass+custom} placeholder='Your Email' id='email' type='email' onChange={(e)=>setEmail(e.target.value)} required/>
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
                  <i  style={{margin:"auto 5px"}}  className="fa-solid fa-key fa-rotate-180 fa-2x"></i>
                  <input className={fixedInputClass+custom} placeholder='Password' id='pass' type={show ?'text':'password'} onChange={(e)=>setPassword(e.target.value)} required/>
                  <button style={{width:"10%",display:"flex",justifyContent:"center",alignItems:"center"}}className={custom+fixedInputClass} onClick={handleClick}>{show ? <><i class="fa-solid fa-eye-slash fa-2x"></i></>:<><i class="fa-solid fa-eye fa-2x"></i></>}</button>
            </div>

            <div className="d-flex flex-row align-items-center mb-4">
                  <i  style={{margin:"auto 5px"}}  className="fa-solid fa-key fa-rotate-180 fa-2x"></i>
                  <input className={fixedInputClass+custom} placeholder='Repeat your password' id='cpass' type={confirmShow ?'text':'password'} onChange={(e)=>setConfirmpassword(e.target.value)} required/>
                  <button style={{width:"10%",display:"flex",justifyContent:"center",alignItems:"center"}}className={custom+fixedInputClass} onClick={handleClickConfirm}>{confirmShow ? <><i class="fa-solid fa-eye-slash fa-2x"></i></>:<><i class="fa-solid fa-eye fa-2x"></i></>}</button>
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
                  <i style={{margin:"auto 5px"}}  class="fa-solid fa-image fa-2x"></i>
                  <input placeholder='Profile Picture' id='pic' type='file' accept="image/*" onChange={(e)=>postDetails(e.target.files[0])}/>
            </div>
            <button className="button" onClick={submitHandler}> Register</button>
      </div>
    </div>  
  )
}

export default SignUp
