pragma solidity >=0.7.0 <0.9.0;

contract Database {

    struct User {
        string userName;
        string about;
        string userId;
        string profilePhoto;
        address ethereumAddress;
        Friend[] friendList;
        Group[] groupList;
        Settings settings;
    }

    struct Friend {
        address pubkey;
        string name;
    }

    struct Message {
        address sender;
        uint256 timestamp;
        string data;
    }

    struct Group {
        string groupName;
        string groupAbout;
        string groupPhoto;
        address admin;
        address[] membersArray;
        Message[] messages;
    }

    struct Settings{
        string wallpaper;
        bool theme;
    }

    //Group[] public allGroups;
    mapping(address => User) userList;
    mapping(bytes32 => Message[]) allMessages;

    function checkUserExists(address pubkey) public view returns(bool) {
        return bytes(userList[pubkey].userName).length > 0;
    }

    function getUserName(address pubkey) external view returns(string memory) {
        require(checkUserExists(pubkey), "User is not registered!");
        return userList[pubkey].userName;
    }

    function createAccount(string calldata userName) external {
        require(checkUserExists(msg.sender)==false, "User already exists!");
        require(bytes(userName).length>0, "User Name cannot be empty!"); 
        userList[msg.sender].userName = userName;
    }

    function checkAlreadyFriends(address pubkey1, address pubkey2) internal view returns(bool) {
        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length){
            address tmp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = tmp;
        }

        for(uint i=0; i<userList[pubkey1].friendList.length; ++i){
            if(userList[pubkey1].friendList[i].pubkey == pubkey2)
                return true;
        }
        return false;
    }

    function addFriend(address friend_key, string calldata userName) external {
        require(checkUserExists(msg.sender), "Create an account first!");
        require(checkUserExists(friend_key), "User is not registered!");
        require(msg.sender!=friend_key, "Users cannot add themselves as a friend!");
        require(checkAlreadyFriends(msg.sender,friend_key)==false, "These users are already friends!");

        _addFriend(msg.sender, friend_key, userName);
        _addFriend(friend_key, msg.sender, userList[msg.sender].userName);
    }

    function _addFriend(address me, address friend_key, string memory userName) internal {
        Friend memory newFriend = Friend(friend_key, userName);
        userList[me].friendList.push(newFriend);
    }

    function getMyFriendList() external view returns(Friend[] memory) {
        return userList[msg.sender].friendList;
    }

    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32) {
        if(pubkey1 < pubkey2)
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        else
            return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    function sendMessage(address friend_key, string calldata _msg) external {
        require(checkUserExists(msg.sender), "Create an account first!");
        require(checkUserExists(friend_key), "User is not registered!");
        require(checkAlreadyFriends(msg.sender,friend_key), "You are not friends with the given user");

        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        Message memory newMsg = Message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    function readMessage(address friend_key) external view returns(Message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }

    //Group functions
    function addGroup(string memory name, string memory about) public {
        require(checkUserExists(msg.sender), "Create an account first!");
        uint n = userList[msg.sender].groupList.length;
        userList[msg.sender].groupList[n].groupName = name;
        userList[msg.sender].groupList[n].admin = msg.sender;
        userList[msg.sender].groupList[n].groupAbout = about;
        userList[msg.sender].groupList[n].groupPhoto = "";
        uint m = userList[msg.sender].groupList[n].membersArray.length;
        userList[msg.sender].groupList[n].membersArray[m] = msg.sender;
    }
    
    function getMyGroupList() external view returns(Group[] memory) {
        return userList[msg.sender].groupList;
    }

    function addGroupMembers(address me, string memory name, address newMember) public {
        require(checkUserExists(msg.sender), "Create an account first!");
        require(checkUserExists(newMember), "User is not registered!");
        require(msg.sender!=newMember, "Users cannot add yourself again!");
        uint i = 0;
        for(i = 0; i < userList[me].groupList.length; ++i){
            if(keccak256(abi.encodePacked(userList[me].groupList[i].groupName)) == keccak256(abi.encodePacked(name))){
                break;
            }
        }
        require(userList[me].groupList[i].admin == msg.sender, "You are not an admin of this group");
        userList[me].groupList[i].membersArray.push(newMember);
    }

    function removeGroupMembers(address me, string memory name, address memberToRemove) public {
        uint i = 0;
        for(i = 0; i < userList[me].groupList.length; ++i){
            if(keccak256(abi.encodePacked(userList[me].groupList[i].groupName)) == keccak256(abi.encodePacked(name))){
                break;
            }
        }
        require(userList[me].groupList[i].admin == msg.sender, "You are not admin");
        uint j = 0;
        for(j = 0; j < userList[me].groupList[i].membersArray.length; ++j){
            if(userList[me].groupList[i].membersArray[j] == memberToRemove){
                break;
            }
        }
        delete userList[me].groupList[i].membersArray[j];
    }

    function sendMessageGroup(address me, string memory name, string calldata _msg) external {
        uint i = 0;
        for(i = 0; i < userList[me].groupList.length; ++i){
            if(keccak256(abi.encodePacked(userList[me].groupList[i].groupName)) == keccak256(abi.encodePacked(name))){
                break;
            }
        }
        Message memory newMsg = Message(msg.sender, block.timestamp, _msg);
        userList[me].groupList[i].messages.push(newMsg);
    }

    function readMessageGroup(address me, string memory name) external view returns(Message[] memory) {
        uint i = 0;
        for(i = 0; i < userList[me].groupList.length; ++i){
            if(keccak256(abi.encodePacked(userList[me].groupList[i].groupName)) == keccak256(abi.encodePacked(name))){
                break;
            }
        }
        return userList[me].groupList[i].messages;
    }
}