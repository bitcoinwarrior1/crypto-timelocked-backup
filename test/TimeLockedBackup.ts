import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {TimeLockedBackup__factory, Registry__factory, Registry} from "../typechain-types";

describe("TimeLockedBackup core functions", function () {

  let userA: SignerWithAddress;
  let userB: SignerWithAddress;
  let deployer: SignerWithAddress;
  let registry: Registry;
  let block;
  let now;

  beforeEach(async() => {
    [deployer, userA, userB] = await ethers.getSigners();
    registry = await new Registry__factory(deployer).deploy();
    block = await ethers.provider.getBlock("latest");
    now = block.timestamp;
  });

  it("allows the user to create deploy the contract when constraints are met", async() => {
    const ethBalanceUserB = await ethers.provider.getBalance(userB.address);
    await registry.connect(userA).set({ notValidBefore: now, notValidAfter: now + 1000, recipient: userB.address });
    await new TimeLockedBackup__factory(userA).deploy(userB.address, now, now + 1000, registry.address, { value: 1000000 });
    const ethBalanceUserBAfter = await ethers.provider.getBalance(userB.address);
    expect(ethBalanceUserBAfter).to.equal(ethBalanceUserB.add(1000000), "userB should have received the funds from userA");
  });

  it("should fail if the time constraints are not met", async() => {
    const tx = new TimeLockedBackup__factory(userA).deploy(userB.address, now + 9999999, now + 99999999, registry.address, registry.address);
    expect(tx).to.be.revertedWith("TimeLockedBackup: recipient not set");
  });

  it("should default to the constructor params if params are not set in the registry", async() => {
    const deployerBalance = await ethers.provider.getBalance(deployer.address);
    await new TimeLockedBackup__factory(userA).deploy(deployer.address, now, now + 1000, registry.address, { value: 1000000 });
    const deployerBalanceAfter = await ethers.provider.getBalance(deployer.address);
    expect(deployerBalanceAfter).to.equal(deployerBalance.add(1000000), "deployer should have received the funds");
  });

  it("should override the default parameters if set in the registry", async() => {
    const ethBalanceUserB = await ethers.provider.getBalance(userB.address);
    const deployerBalance = await ethers.provider.getBalance(deployer.address);
    await registry.connect(userA).set({ notValidBefore: now, notValidAfter: now + 1000, recipient: userB.address });
    await new TimeLockedBackup__factory(userA).deploy(deployer.address, now, now + 1000, registry.address, { value: 1000000 });
    const ethBalanceUserBAfter = await ethers.provider.getBalance(userB.address);
    const deployerBalanceAfter = await ethers.provider.getBalance(deployer.address);
    expect(deployerBalance).to.equal(deployerBalanceAfter, "deployer balance should be unchanged");
    expect(ethBalanceUserBAfter).to.equal(ethBalanceUserB.add(1000000), "userB should have received the funds from userA");
  });

});
