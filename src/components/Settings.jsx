import React from "react";
import { Row, Card } from "react-bootstrap";
import ReactDOM from 'react-dom';  
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'  

export function Settings(props) {
  return (
    <div>
        <Button
            style={{ display: props.showButton }}
            variant="primary"
            onClick={async () => {
              props.login();
            }}
          >
            Connect to Metamask
        </Button>
    </div>
  );
}