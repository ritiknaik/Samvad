import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { UploadWallpaper } from "./UploadWallpaper"

export function Example(props) {
    const [show, setShow] = useState(false);
    const [showwall, setShowWall] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleCloseWall = () => setShowWall(false);
    const handleShowWall = () => setShowWall(true);
    // const [imageUrl, setImageUrl] = useState("");
  
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
            <Button variant="secondary" 
                    onClick={() => {
                      handleClose();
                      handleShowWall();
                    }}>
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

        <Modal show={showwall} onHide={handleCloseWall}>
          <Modal.Header closeButton>
            <Modal.Title>Upload Wallpaper</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <UploadWallpaper 
            imageUrl={props.imageUrl}
            setImageUrlHandler={(imageUrl) => props.setImageUrlHandler(imageUrl)}/>
              
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  