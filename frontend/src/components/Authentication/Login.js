import React,{useState} from 'react'
import axios from "axios";
import {useHistory} from "react-router-dom";
import { ChatState } from '../../Context/ChatProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../styles/style.css"

const fixedInputClass="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
const custom="text-md block px-3 py-2  rounded-lg w-full border-2 border-gray-300 placeholder-gray-600 shadow-md focus:placeholder-gray-500  focus:border-gray-600 focus:outline-none"
const Login = () => {
  const [show,setShow]=useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const {user,setUser}=ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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

      toast.success("Logged in Successfully", {
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
      history.push("/chats");
    } catch (error) {
      toast.error("Invalid Credentials", {
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

  return (
    <div>
      <div className="mt-8 space-y-6" style={{padding:"0px 10px 5px 10px"}}>
        <div className="-space-y-px">
          <div className="my-5">
            <div className="flex">
                <i style={{margin:"auto 5px"}} class="fa-solid fa-envelope fa-2x"></i>
                <label htmlFor="email" className="sr-only">Email:</label>
                <input
                  style={{margin:"auto 5px"}}
                  onChange={(e)=>setEmail(e.target.value)}
                  id="email_1"
                  type="email"
                  required
                  className={fixedInputClass+custom}
                  placeholder="Email Address"
                />
            </div>
          </div>
          <div className="my-5 flex">
              <i  style={{margin:"auto 5px"}}  className="fa-solid fa-key fa-rotate-180 fa-2x"></i>
                <label htmlFor="password" className="sr-only">
                  Password:
                </label>
                <input
                  style={{margin:"auto 5px"}}
                  onChange={(e)=>setPassword(e.target.value)}
                  id="pass_1"
                  type={show ?'text':'password'}
                  required
                  className={fixedInputClass+custom}
                  placeholder="Password"
                />
                <button style={{width:"10%",display:"flex",justifyContent:"center",alignItems:"center"}}className={custom+fixedInputClass} onClick={handleClick}>{show ? <><i class="fa-solid fa-eye-slash fa-lg"></i></>:<><i class="fa-solid fa-eye fa-lg"></i></>}</button>
          </div>
        </div>
        <button className=" button" onClick={submitHandler}>Login</button>
      </div>
    </div>
  )
}

export default Login
