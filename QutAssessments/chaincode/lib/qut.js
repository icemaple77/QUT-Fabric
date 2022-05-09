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
    //Each student only has a unique studentID.
    const students = [
      {
        ID: "N10837353",
        Name: "Yena Park",
        Degree: "Master of Information Technology",
        Major: "Computer Science",
        UintID: ["IFN711", "IFN666"],
      },
      {
        ID: "N10629297",
        Name: "Michael",
        Degree: "Master of Information Technology",
        Major: "Computer Science",
        UintID: ["IFN711", "IFN666", "IFN664", "ENN523"],
      },
      {
        ID: "N10892915",
        Name: "Doris Che",
        Degree: "Master of Information Technology",
        Major: "Computer Science",
        UintID: ["IFN711", "IFN521", "IFN507"],
      },
    ];
    //Each Unit only has a unique unitID.
    const Units = [
      {
        ID: "IFN711",
        Assessment: ["Industry Project"],
        Criteria: ["Introduction (10%)"],
        Achievement: [
          "Background of the Industry/partner and the problem/ opportunity proposed to be addressed is described precisely with comprehensive but succinct content; The anticipated results and outcomes are clearly stated, illustrating how they will impact diverse stakeholders.",
        ],
      },
      {
        ID: "IFN666",
        Assessment: ["Web Design & Programming"],
        Criteria: ["Reac t& React Native"],
        Achievement: [
          "1.	The overall level of functionality successfully implemented",
          "2.	The robustness of the application",
          "3.	The user interface design of the application",
          "4.	Application architecture and code quality",
          "5.	The quality of the report",
          "6.	The quality of the demonstration video",
        ],
      },
      {
        ID: "IFN664",
        Assessment: ["Industry Project"],
        Criteria: ["Introduction (10%)"],
        Achievement: [
          "Background of the Industry/partner and the problem/ opportunity proposed to be addressed is described precisely with comprehensive but succinct content; The anticipated results and outcomes are clearly stated, illustrating how they will impact diverse stakeholders.",
        ],
      },
    ];
    //one student with one unit only has a unique report
    const Reports = [
      {
        ID: "N10629297IFN711",
        Grade: "High Distinction",
        state: "Approved",
      },
      {
        ID: "N10629297IFN666",
        Grade: "Distinction",
        state: "Pending",
      },
    ];

    for (const student of students) {
      await ctx.stub.putState(student.ID, Buffer.from(JSON.stringify(student)));
      console.info(`Asset ${student.ID} initialized`);
    }
    for (const Unit of Units) {
      await ctx.stub.putState(Unit.ID, Buffer.from(JSON.stringify(Unit)));
      console.info(`Asset ${Unit.ID} initialized`);
    }
    for (const Report of Reports) {
      await ctx.stub.putState(Report.ID, Buffer.from(JSON.stringify(Report)));
      console.info(`Asset ${Report.ID} initialized`);
    }
    console.info("============= Success : Initialize Ledger ===========");
  }
  async myAssetExists(ctx, myAssetId) {
    const buffer = await ctx.stub.getState(myAssetId);
    return !!buffer && buffer.length > 0;
  }
  async createStudent(ctx, studentID, name, degree, major, Unitid) {
    const exists = await this.myAssetExists(ctx, studentID);
    if (exists) {
      return false;

      throw new Error(`The Student: ${studentID} already exists`);
    } else {
      const asset = {
        ID: studentID,
        Name: name,
        Degree: degree,
        Major: major,
        UintID: [Unitid],
      };
      const buffer = Buffer.from(JSON.stringify(asset));
      await ctx.stub.putState(studentID, buffer);
      return true;
    }
  }
  async createUnit(ctx, unitID, Assessment, Criteria, Achievement) {
    const exists = await this.myAssetExists(ctx, unitID);
    if (exists) {
      return false;
      //throw new Error(`The Unit: ${unitID} already exists`);
    } else {
      const asset = {
        ID: unitID,
        Criteria: Criteria,
        Achievement: Achievement,
        Assessment: [Assessment],
      };
      const buffer = Buffer.from(JSON.stringify(asset));
      await ctx.stub.putState(unitID, buffer);
      return true;
    }
  }
  async createReport(ctx, studentID, unitID, Grade) {
    const reportID = `${studentID}${unitID}`;
    const exists = await this.myAssetExists(ctx, reportID);
    if (exists) {
      return false;
      //throw new Error(`The my asset ${reportID} already exists`);
    } else {
      const asset = {
        ID: reportID,
        Grade: Grade,
        state: "Pending",
      };
      const buffer = Buffer.from(JSON.stringify(asset));
      await ctx.stub.putState(reportID, buffer);
      return true;
    }
  }
  async updateState(ctx, studentID, unitID) {
    const reportID = `${studentID}${unitID}`;
    const exists = await this.myAssetExists(ctx, reportID);
    if (!exists) {
      return false;
      //throw new Error(`The Report: ${reportID} does not exist`);
    }
    const asset = Get(ctx, reportID);
    asset.state = "Approved";
    const buffer = Buffer.from(JSON.stringify(asset));
    await ctx.stub.putState(reportID, buffer);
    return true;
  }

  async Get(ctx, ID) {
    console.log("============= Start : Search Ledger ===========");
    const exists = await this.myAssetExists(ctx, ID);
    if (!exists) {
      return false;
      //throw new Error(`The my asset ${ID} does not exist`);
    } else {
      const buffer = await ctx.stub.getState(ID);
      const asset = JSON.parse(buffer.toString());
      console.log("============= End : Search Ledger ===========");
      return asset;
    }
    const buffer = await ctx.stub.getState(ID);
    const asset = JSON.parse(buffer.toString());
    console.log("============= End : Search Ledger ===========");
    return asset;
  }
  async deleteMyAsset(ctx, ID) {
    const exists = await this.myAssetExists(ctx, ID);
    if (!exists) {
      return false;
      //throw new Error(`The my asset ${ID} does not exist`);
    }
    await ctx.stub.deleteState(ID);
  }
}
module.exports = QUTAssessment;
