pragma solidity >=0.7.0 <0.9.0;

contract Migrations {
    address public owner;
    uint last_completed_migration;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if(owner == msg.sender) _;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}