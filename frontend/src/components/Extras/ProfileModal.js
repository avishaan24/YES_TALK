import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ProfileModal = ({user,children}) => {
      const [show, setShow] = useState(false);

      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
  return (
      <>
      {children?(<span onClick={handleShow}>{children}</span>):(
            <i class="fa fa-eye" aria-hidden="true" onClick={handleShow}></i>
      )}
      <Modal size="lg" show={show} onHide={handleClose} centered>
        <Modal.Header style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"center"}}closeButton>
          <Modal.Title>{user.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between"}}>
        <img src={user.avatar} className="rounded-circle" height={200} alt="Avatar" style={{padding:"4px 10px"}}/>
        <div>Email: {user.email}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  )
}

export default ProfileModal
