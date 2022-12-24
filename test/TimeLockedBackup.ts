import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TimeLockedBackup__factory } from "../typechain-types";

describe("TimeLockedBackup core functions", function () {

  let team: SignerWithAddress;
  let userA: SignerWithAddress;
  let userB: SignerWithAddress;

  beforeEach(async() => {
    [team, userA, userB] = await ethers.getSigners();
  });

  it("allows the user to create many signed contract creation transactions with value", async() => {

  });

});
