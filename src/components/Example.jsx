import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export function Example() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="light"
         onClick={handleShow}
           style={{margin: "7px"}}>
          <img src={`${process.env.PUBLIC_URL}/more-options-icon-10.jpg`} alt="inv" style={{width: "30px", height: "25px"}} />
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
          </Modal.Header>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Change wallpaper
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Update Profile Photo
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Update About
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  