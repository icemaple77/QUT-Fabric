/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

async function main() {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",

      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("appUser");
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("qut");

    // Evaluate the specified transaction.

    const studentID = "N10629297";
    const unitID = "IFN666";
    // Query student
    const result1 = await contract.evaluateTransaction("Get", studentID);
    //Query unit
    const result2 = await contract.evaluateTransaction("Get", unitID);
    //Query Report
    const result3 = await contract.evaluateTransaction(
      "Get",
      studentID + unitID
    );
    //Query a unexist value .return false
    // const result4 = await contract.evaluateTransaction("Get", "1234");
    // console.log("====================search student======================");
    // console.log(`This student ${studentID} details is: ${result1}`);
    // console.log();
    // console.log("====================search unit======================");
    // console.log(`This unit ${unitID} details is: ${result2}`);
    // console.log();
    console.log("====================search report======================");
    console.log(`This Report ${studentID + unitID} details is: ${result3}`);
    console.log();
    // console.log("====================search Nothing======================");
    // console.log(`This Report details is: ${result4}`);

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

main();
