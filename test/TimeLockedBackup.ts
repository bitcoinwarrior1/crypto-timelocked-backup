import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {TimeLockedBackup__factory, Registry__factory, Registry} from "../typechain-types";

describe("TimeLockedBackup core functions", function () {

  let userA: SignerWithAddress;
  let userB: SignerWithAddress;
  let deployer: SignerWithAddress;
  let registry: Registry;

  beforeEach(async() => {
    [deployer, userA, userB] = await ethers.getSigners();
    registry = await new Registry__factory(deployer).deploy();
  });

  it("allows the user to create deploy the contract when constraints are met", async() => {
    const block = await ethers.provider.getBlock("latest");
    const now = block.timestamp;
    const ethBalanceUserA = await ethers.provider.getBalance(userA.address);
    await registry.connect(userA).set({ notValidBefore: now, notValidAfter: now + 1000, recipient: userB.address });
    await new TimeLockedBackup__factory(userA).deploy(registry.address, { value: 1000000 });
    const ethBalanceUserB = await ethers.provider.getBalance(userB.address);
    expect(ethBalanceUserB).to.equal(ethBalanceUserA.add(1000000), "userB should have received the funds from userA");
  });

  it("should fail if constraints are not set", async() => {
    const tx = new TimeLockedBackup__factory(userA).deploy(registry.address);
    expect(tx).to.be.revertedWith("TimeLockedBackup: recipient not set");
  });

});
