/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

class QUTAssessment extends Contract {
  //1 initleger
  async initLedger(ctx) {
    console.info("============= START : Initialize Ledger ===========");
    await ctx.stub.putState("test", "hello world");
    return "success";
  }
  //2 writeData
  async writeDate(ctx, key, value) {
    await ctx.stub.putState(key, value);
    return value;
  }
  //3 ReadData
  async readData(ctx, key) {
    var Response = await ctx.stub.getState(key);
    return Response.toString();
  }
}
module.exports = QUTAssessment;
