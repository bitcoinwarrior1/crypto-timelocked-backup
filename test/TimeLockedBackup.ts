import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TimeLockedBackup__factory } from "../typechain-types";

describe("TimeLockedBackup core functions", function () {

  let userA: SignerWithAddress;
  let userB: SignerWithAddress;

  beforeEach(async() => {
    [userA, userB] = await ethers.getSigners();
  });

  it("allows the user to create deploy the contract when constraints are met", async() => {
    const block = await ethers.provider.getBlock("latest");
    const now = block.timestamp;
    const ethBalanceUserA = await ethers.provider.getBalance(userA.address);
    await new TimeLockedBackup__factory(userA).deploy(userB.address, now, now + 1000, { value: 1000000 });
    const ethBalanceUserB = await ethers.provider.getBalance(userB.address);
    expect(ethBalanceUserB).to.equal(ethBalanceUserA.add(1000000), "userB should have received the funds from userA");
  });

});
