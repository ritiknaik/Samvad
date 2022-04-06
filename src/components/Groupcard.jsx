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
          props.getGroupMessages(props.name);
        }}
      >
        <Card.Body>
          <Card.Title> {props.name} </Card.Title>
          <Card.Subtitle>
            {" "}
            {props.about}{" "}
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Row>
  );
}