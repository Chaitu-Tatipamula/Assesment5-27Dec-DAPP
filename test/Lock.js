const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", () => {
  let Token, token, owner, addr1, addr2;

  beforeEach(async () => {
    // Deploy the contract
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.deploy();
  });

  describe("Deployment", () => {
    it("Should set the correct token name and symbol", async () => {
      expect(await token.name()).to.equal("UTIL Token");
      expect(await token.symbol()).to.equal("TKN");
    });

    it("Should assign the initial supply to the admin", async () => {
      const adminBalance = await token.balanceOf(owner.address);
      expect(BigInt(adminBalance)).to.equal(ethers.parseUnits("1000000"));
    });

    it("Should set the deployer as the admin", async () => {
      expect(await token.admin()).to.equal(owner.address);
    });
  });

  describe("Minting", () => {
    it("Should allow the admin to mint tokens", async () => {
      const mintAmount = ethers.parseEther("100");
      await token.mint(addr1.address, mintAmount);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(mintAmount);
    });

    it("Should not allow non-admin to mint tokens", async () => {
      const mintAmount = ethers.parseEther("100");
      await expect(
        token.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWith("Only admin can mint");
    });
  });

  describe("Transferring Tokens", () => {
    it("Should allow users to transfer tokens", async () => {
      const transferAmount = ethers.parseEther("50");
      await token.transfer(addr1.address, transferAmount);

      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);

      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(
        ethers.parseEther("1000000") - transferAmount
      );
    });

    it("Should fail if sender does not have enough balance", async () => {
      const transferAmount = ethers.parseEther("50");
      await expect(
        token.connect(addr1).transferTokens(addr2.address, transferAmount)
      ).to.be.revertedWithCustomError(token, "InsufficientBalance");
    });
  });

  describe("Balance Checking", () => {
    it("Should return the correct balance for the caller", async () => {
      const balance = await token.connect(owner).balance();
      expect(balance).to.equal(ethers.parseEther("1000000"));
    });

    it("Should return the correct balance after transfers", async () => {
      const transferAmount = ethers.parseEther("100");
      await token.transfer(addr1.address, transferAmount);

      const balance = await token.connect(addr1).balance();
      expect(balance).to.equal(transferAmount);
    });
  });
});
