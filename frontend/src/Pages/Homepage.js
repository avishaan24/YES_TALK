import React, { useEffect} from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useHistory } from 'react-router-dom';

import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';

const Homepage = () => {
  const history=useHistory();
  useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("userInfo"));
        // console.log({user});
        if(user){
          console.log(`${user.name}`);
              history.push("/chats")
        }
  },[history])
  return (
    <div style={{"backgroundColor":"cyan","width":"100%","height":"100vh"}}>
      <div style={{"backgroundColor":"white","alignContent":"center","alignItems":"center","textAlign":"center","width":"40%","margin":"auto"}}>Friendhip</div>
      <div style={{"backgroundColor":"white","alignContent":"center","alignItems":"center","textAlign":"center","width":"40%","margin":"auto"}}>
        <Tabs
          defaultActiveKey="login"
          id="uncontrolled-tab-example"
          className="mb-3">
          <Tab eventKey="login" title="Login"><Login /></Tab>
          <Tab eventKey="signup" title="SignUp"><SignUp /></Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default Homepage