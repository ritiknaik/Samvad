import React from "react";
import { Row, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export function GroupCard(props) {
  return (
    <Row style={{ marginRight: "0px" }}>
      <Card
        border="primary"
        style={{ width: "100%", alignSelf: "center", marginLeft: "15px" }}
        onClick={() => {
          props.getMessages(props.publicKey);
        }}
      >
        <Card.Body>
          <Card.Title> {props.name} </Card.Title>
          <Card.Subtitle>
            {" "}
            {props.publicKey.length > 20
              ? props.publicKey.substring(0, 20) + " ..."
              : props.publicKey}{" "}
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Row>
  );
}