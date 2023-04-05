import React from 'react'

const UserBadge = ({user,handleFunction}) => {
  return (
    <div style={{display:"flex",flexDirection:"row", borderRadius:"10px",fontSize:"15px",background:"#6666cc",color:"white",cursor:"pointer",margin:"2px",padding:"5px"}} onClick={handleFunction}>
      <div style={{padding:"2px"}}>{user.name}</div>
      <i className="fas fa-user-times" style={{color:"white",padding:"2px",margin:"2px"}}></i>
    </div>
  )
}

export default UserBadge
