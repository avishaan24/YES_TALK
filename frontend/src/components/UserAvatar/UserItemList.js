import React from 'react'

const UserItemList = ({user,handleFunction}) => {
  return (
    <div onClick={handleFunction} style={{cursor:"pointer",background:"#ccffe6",width:"100%",display:"flex",alignItems:"center",color:"black",padding:"3px 2px",marginBottom:"2px",borderRadius:"10px"}}>
      <img src={user.avatar} className="rounded-circle" alt="Avatar" style={{padding:"4px 10px",height:"35px"}}/>
      <div>
            <div>{user.name}</div>
            <div>{user.email}</div>
      </div>
    </div>
  )
}

export default UserItemList
