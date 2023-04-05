import React, { useEffect } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useHistory, Link } from 'react-router-dom';
import logo from "../Images/Logo.png";
import "../styles/style.css"

import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      console.log(`${user.name}`);
      history.push("/chats")
    }
  }, [history])
  return (
    <div className='large '>
      <div className='login_box w-4/5 sm:w-2/5 md:w-4/12'>
        <div className="mb-10">
          <div className="flex justify-center">
            <img style={{margin:"3vh 0px 0px 0px"}} alt="" className="h-20 w-20"src={logo}/>
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">YES TALK</h2>
        </div>
        <Tabs defaultActiveKey="login"id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="login" title="Login"><Login /></Tab>
          <Tab eventKey="signup" title="SignUp"><SignUp /></Tab>
        </Tabs>
      </div>

    </div>
  )
}

export default Homepage