pragma solidity >=0.7.0 <0.9.0;

contract Database {

    struct User {
        string userName;
        string about;
        string userId;
        string profilePhoto;
        address ethereumAddress;
        Friend[] friendList;
    }

    struct Friend {
        string friendId;
    }

    struct Message {
        address sender;
        string messageId;
        string msg;
    }

    struct Group {
        string groupName;
        string groupId;
        string groupAbout;
        string groupPhoto;
        address admin;
        address[] membersArray;
        mapping(address=>bool) members;
        mapping(uint => Message) messages;
    }

    mapping(address => User) userList;
    mapping(bytes32 => Message[]) allMessages;

}