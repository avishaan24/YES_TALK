import React,{useState} from 'react'
import axios from "axios";
import {useHistory} from "react-router-dom";
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';

const Login = () => {
  const [show,setShow]=useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const {user,setUser}=ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      const userInfo=JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div>
            <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i fas icon="envelope me-3" size='lg'/> */}
                  <label htmlFor="email">Email:</label>
                  <input placeholder='Your Email' id='email_1' type='email' onChange={(e)=>setEmail(e.target.value)} required/>
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i fas icon="lock me-3" size='lg'/> */}
                  <label htmlFor="id">Password:</label>
                  <input placeholder='Password' id='pass_1' type={show ?'text':'password'} onChange={(e)=>setPassword(e.target.value)} required/>
                  <button onClick={handleClick}>{show ? "Hide":"Show"}</button>
            </div>
            <div>
                  <button className='btn-primary' onClick={submitHandler}>Login</button>
            </div>
    </div>
  )
}

export default Login
