// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable(msg.sender) {
    address public admin;
    error InsufficientBalance(address sender, uint256 requested, uint256 available);

    constructor() ERC20("UTIL Token", "TKN") {
        admin = msg.sender;
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "Only admin can mint");
        _mint(to, amount);
    }

    function transferTokens(address to, uint256 amount) external {
        uint256 tokensBalance = balanceOf(msg.sender);
        if (amount > tokensBalance) {
            revert InsufficientBalance(msg.sender, amount, tokensBalance);
        }
        _transfer(msg.sender, to, amount);
    }

    function balance() public view returns(uint256) {
        return balanceOf(msg.sender);
    }
}
