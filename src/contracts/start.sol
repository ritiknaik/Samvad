pragma solidity >=0.7.0 <0.9.0;

contract GetSet {

    uint256 number;

    function set(uint256 num) public {
        number = num;
    }

    function get() public view returns (uint256){
        return number;
    }
}