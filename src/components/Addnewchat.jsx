import React from "react";
import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

export function AddNewChat(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showGroup, setShowGroup] = useState(false);
  const handleCloseGroup = () => setShowGroup(false);
  const handleShowGroup = () => setShowGroup(true);
  return (
    <div
      className="AddNewChat"
      style={{
        position: "absolute",
        bottom: "0px",
        padding: "10px 45px 0 45px",
        margin: "0 95px 0 0",
        width: "97%",
      }}
    >
      <Button variant="success" className="mb-2" onClick={handleShow} style={{marginLeft: "90px"}}>
        + Add Chat
      </Button>
      <Button variant="success" className="mb-2" onClick={handleShowGroup} style={{marginLeft: "35px"}}>
        + Create Group
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> Add New Friend </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              required
              id="addPublicKey"
              size="text"
              type="text"
              placeholder="Enter Friends Public Key"
            />
            <br />
            <Form.Control
              required
              id="addName"
              size="text"
              type="text"
              placeholder="Name"
            />
            <br />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.addHandler(
                document.getElementById("addName").value,
                document.getElementById("addPublicKey").value
              );
              handleClose();
            }}
          >
            Add Friend
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showGroup} onHide={handleCloseGroup}>
        <Modal.Header closeButton>
          <Modal.Title> Create Group </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              required
              id="groupName"
              size="text"
              type="text"
              placeholder="Enter Group Name"
            />
            <br />
            <Form.Control
              required
              id="groupAbout"
              size="text"
              type="text"
              placeholder="Enter Group About"
            />
            <br />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseGroup}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.addGroupHandler(
                document.getElementById("groupName").value,
                document.getElementById("groupAbout").value
              );
              handleClose();
            }}
          >
            Make Group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}