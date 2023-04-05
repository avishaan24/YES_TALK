import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';


const ProfileModal = ({user,children}) => {
      const [show, setShow] = useState(false);

      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
  return (
      <>
      {children?(<span onClick={handleShow}>{children}</span>):(
            <i class="fa fa-eye" aria-hidden="true" onClick={handleShow} style={{cursor:"pointer"}}></i>
      )}
      <Modal size="lg" show={show} onHide={handleClose}  centered>
        <Modal.Header style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center",background:"#c6c6ec"}}closeButton>
          <Modal.Title>{user.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",background:"#c6c6ec"}}>
        <img src={user.avatar} className="rounded-circle" alt="Avatar" style={{padding:"4px 10px",height:"30vh"}}/>
        <div>Email: {user.email}</div>
        </Modal.Body>
        <Modal.Footer style={{background:"#c6c6ec"}}>
          <button style={{display:'flex',justifyContent:"center",fontWeight:"regular",border:"transparent",color:"white",padding:"10px",background:"blue",borderRadius:"10px",margin:"0px 5px"}} onClick={handleClose}>Close</button>
        </Modal.Footer>
      </Modal>
      </>
  )
}

export default ProfileModal
