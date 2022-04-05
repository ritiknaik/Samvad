import React from "react";
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import {
  NavBar,
  ChatCard,
  Message,
  AddNewChat,
} from "./components/Components.js";
import { ethers } from "ethers";
import file from "./truffle_abis/Database.json";

let abi = file.abi;
// Add the contract address inside the quotes
const CONTRACT_ADDRESS = "0xaDbB6f2b8d07531f5e7b63192f4931dee6e40D5d";

export function App(props) {
  const [friends, setFriends] = useState(null);
  const [myName, setMyName] = useState(null);
  const [myPublicKey, setMyPublicKey] = useState(null);
  const [activeChat, setActiveChat] = useState({
    publicKey: null,
    name: null,
  });
  const [activeChatMessages, setActiveChatMessages] = useState(null);
  const [showConnectButton, setShowConnectButton] = useState("block");
  const [myContract, setMyContract] = useState(null);
  const [image, setImage] = useState(null)

  const contractABI = abi;
  let provider;
  let signer;

  async function login() {
    let res = await connectToMetamask();
    if (res === true) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      try {
        console.log(CONTRACT_ADDRESS);
        console.log(contractABI);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          signer
        );
        console.log(CONTRACT_ADDRESS);
        setMyContract(contract);
        const address = await signer.getAddress();
        let present = await contract.checkUserExists(address);
        let username;
        if (present) username = await contract.getUserName(address);
        else {
          username = prompt("Enter a username", "Guest");
          if (username === "") username = "Guest";
          await contract.createAccount(username);
        }
        setMyName(username);
        setMyPublicKey(address);
        setShowConnectButton("none");
      } catch (err) {
        console.log(err);
        alert("CONTRACT_ADDRESS not set properly!");
      }
    } else {
      alert("Couldn't connect to Metamask");
    }
  }


  async function connectToMetamask() {
    try {
      await window.ethereum.enable();
      return true;
    } catch (err) {
      return false;
    }
  }

  async function addChat(name, publicKey) {
    try {
      let present = await myContract.checkUserExists(publicKey);
      if (!present) {
        alert("Address not found: Ask them to join the app :)");
        return;
      }
      try {
        await myContract.addFriend(publicKey, name);
        const frnd = { name: name, publicKey: publicKey };
        setFriends(friends.concat(frnd));
      } catch (err) {
        alert(
          "Friend already added! You can't be friends with the same person twice ;P"
        );
      }
    } catch (err) {
      alert("Invalid address!");
    }
  }

  async function sendMessage(data) {
    if (!(activeChat && activeChat.publicKey)) return;
    const recieverAddress = activeChat.publicKey;
    await myContract.sendMessage(recieverAddress, data);
  }

  async function getMessage(friendsPublicKey) {
    let nickname;
    let messages = [];
    friends.forEach((item) => {
      if (item.publicKey === friendsPublicKey) nickname = item.name;
    });
    const data = await myContract.readMessage(friendsPublicKey);
    data.forEach((item) => {
      const timestamp = new Date(1000 * Number(item[1])).toUTCString();
      messages.push({
        publicKey: item[0],
        timeStamp: timestamp,
        data: item[2],
      });
    });
    setActiveChat({ friendname: nickname, publicKey: friendsPublicKey });
    setActiveChatMessages(messages);
  }

  useEffect(() => {
    async function loadFriends() {
      let friendList = [];
      // Get Friends
      try {
        const data = await myContract.getMyFriendList();
        data.forEach((item) => {
          friendList.push({ publicKey: item[0], name: item[1] });
        });
      } catch (err) {
        friendList = null;
      }
      setFriends(friendList);
    }
    loadFriends();
  }, [myPublicKey, myContract]);

  const Messages = activeChatMessages
    ? activeChatMessages.map((message) => {
        let margin = "5%";
        let sender = activeChat.friendname;
        if (message.publicKey === myPublicKey) {
          margin = "15%";
          sender = "You";
        }
        return (
          <Message
            marginLeft={margin}
            sender={sender}
            data={message.data}
            timeStamp={message.timeStamp}
          />
        );
      })
    : null;

  const chats = friends
    ? friends.map((friend) => {
        return (
          <ChatCard
            publicKey={friend.publicKey}
            name={friend.name}
            getMessages={(key) => getMessage(key)}
          />
        );
      })
    : null;

  return (
    <div style={{ padding: "0px", border: "1px solid grey" }}>
      <NavBar
        username={myName}
        login={async () => login()}
        showButton={showConnectButton}
      />
      <Row>
        <Col style={{ paddingRight: "0px", borderRight: "2px solid #000000", height: "844px" }}>
          <div
            style={{
              backgroundColor: "#BAE7F3",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Row style={{ marginRight: "0px" }}>
              <Card
                style={{
                  width: "100%",
                  alignSelf: "center",
                  marginLeft: "15px",
                }}
              >
                <Card.Header>Chats</Card.Header>
              </Card>
            </Row>
            {chats}
            <AddNewChat
              myContract={myContract}
              addHandler={(name, publicKey) => addChat(name, publicKey)}
            />
          </div>
        </Col>
        <Col xs={8} style={{ paddingLeft: "0px" }}>
          <div style={{ backgroundColor: "#BAE7F3", backgroundImage: `${process.env.PUBLIC_URL}/more-options-icon-10.jpg`, height: "100%" }}>
            <Row style={{ marginRight: "0px" }}>
              <Card
                style={{
                  width: "100%",
                  alignSelf: "center",
                  margin: "0 0 5px 15px",
                }}
              >
                <Card.Header>
                  {activeChat.friendname} : {activeChat.publicKey}
                  <Button
                    style={{ float: "right" }}
                    variant="warning"
                    onClick={() => {
                      if (activeChat && activeChat.publicKey)
                        getMessage(activeChat.publicKey);
                    }}
                  >
                    Refresh
                  </Button>
                </Card.Header>
              </Card>
            </Row>
            <div
              className="MessageBox"
              style={{ height: "690px", overflowY: "auto" }}
            >
              {Messages}
            </div>
            <div
              className="SendMessage"
              style={{
                borderTop: "2px solid black",
                position: "relative",
                bottom: "0px",
                padding: "10px 45px 0 45px",
                margin: "0 95px 0 0",
                width: "97%",
              }}
            >
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(document.getElementById("messageData").value);
                  document.getElementById("messageData").value = "";
                }}
              >
                <Form.Row className="align-items-center">
                  <Col xs={10}>
                    <Form.Control
                      id="messageData"
                      className="mb-2"
                      placeholder="Send Message"
                    />
                  </Col>
                  <Col>
                    <Button
                      className="mb-2"
                      variant="dark"
                      style={{ float: "right" }}
                      onClick={() => {
                        sendMessage(
                          document.getElementById("messageData").value
                        );
                        document.getElementById("messageData").value = "";
                      }}
                    >
                      Send
                    </Button>
                  </Col>
                </Form.Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
