import React from 'react'

const UserBadge = ({user,handleFunction}) => {
  return (
    <div style={{borderRadius:"large",fontSize:"12px",background:"green",color:"white",cursor:"pointer",borderEndEndRadius:"large",borderStartStartRadius:"large",margin:"2px",padding:"2px"}} onClick={handleFunction}>
      {user.name}
      {/* <i className='fa fa-close'></i> */}
      <i className="fas fa-bell" style={{color:"black"}}></i>
      {/* <i className="fas fa-bell" style={{padding:"15px 10px",size:"50px",color:"black"}}></i> */}
    </div>
  )
}

export default UserBadge
