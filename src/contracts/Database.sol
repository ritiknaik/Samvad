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
        address pubkey;
        string name;
    }

    struct Message {
        uint messageType; 
        address sender;
        string data;
        uint timestamp;
    }

    struct Group {
        string groupName;
        string groupId;
        string groupAbout;
        string groupPhoto;
        address admin;
        //uint replyCount;
        address[] membersArray;
        Message[] messages;
        mapping(address=>bool) members;
    }

    Group[] public allGroups;
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
        Friend memory newFriend = Friend(friend_key,userName);
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
        Message memory newMsg = Message(0, msg.sender, _msg, block.timestamp);
        allMessages[chatCode].push(newMsg);
    }

    function readMessage(address friend_key) external view returns(Message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        return allMessages[chatCode];
    }
    
    function addGroup(string memory name, string memory about) public {
        Group storage newGroup = allGroups.push();
        
        newGroup.groupName = name;
        newGroup.admin= msg.sender;
        newGroup.groupAbout= about;
        newGroup.groupPhoto= "";
        newGroup.groupId= "";
        newGroup.membersArray= new address[](0);
        
        allGroups[allGroups.length - 1].members[msg.sender] = true;
        allGroups[allGroups.length - 1].membersArray.push(msg.sender);
    }

    function addGroupMembers(uint channelIndex, address newMember) public {
        require (allGroups[channelIndex].admin == msg.sender);
            allGroups[channelIndex].members[newMember] = true;
            allGroups[channelIndex].membersArray.push(newMember);
    }

    function removeGroupMembers(uint channelIndex, address memberToRemove, uint memberIndex) public {
        require (allGroups[channelIndex].admin == msg.sender);
            allGroups[channelIndex].members[memberToRemove] = false;
            delete allGroups[channelIndex].membersArray[memberIndex];
    }

    function sendMessageGroup(uint channelIndex, string calldata _msg) external {
        Message memory newMsg = Message(0, msg.sender, _msg, block.timestamp);
        //uint currReplyIndex = allGroups[channelIndex].replyCount;
        allGroups[channelIndex].messages.push(newMsg);

        //allGroups[channelIndex].replyCount++;
    }

    function readMessageGroup(uint channelIndex) external view returns(Message[] memory) {
        return allGroups[channelIndex].messages;
    }
}