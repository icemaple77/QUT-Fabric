/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

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
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

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

    // Submit the specified transaction.
    const studentxyz = [
      {
        ID: "N110120119",
        Name: "110",
        Degree: "120",
        Major: "119",
        UintID: ["IFN711", "IFN666"],
      },
    ];
    const unitxyz = [
      {
        ID: "IFN711",
        Assessment: ["Industry Project"],
        Criteria: ["Introduction (10%)"],
        Achievement: [
          "Background of the Industry/partner and the problem/ opportunity proposed to be addressed is described precisely with comprehensive but succinct content; The anticipated results and outcomes are clearly stated, illustrating how they will impact diverse stakeholders.",
        ],
      },
    ];
    //Add Student and return a string, "ture" means success,"false" means
    //The Student id already existed
    console.log("=============Start:Add student ============");
    const AddStudent = await contract.submitTransaction(
      "createStudent",
      studentxyz[0].ID,
      studentxyz[0].Name,
      studentxyz[0].Degree,
      studentxyz[0].Major,
      studentxyz[0].UintID
    );
    //
    if (AddStudent == "true")
      console.log(`Add student ${studentxyz[0].ID} has been submitted`);
    else console.log(`The Student ${studentxyz[0].ID} already existed`);
    console.log("=============END: Add student ============");
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    process.exit(1);
  }
}

main();
