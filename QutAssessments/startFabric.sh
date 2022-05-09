#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"javascript"}
CC_SRC_PATH="../QutAssessments/chaincode/"
# clean out any old identites in the wallets
rm -rf ./wallet/*
# launch network; create channel and join peer to channel
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn qut -ccv 1 -cci initLedger -ccl javascript -ccp ${CC_SRC_PATH}
popd

node ./enrollAdmin.js
node ./registerUser.js



cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

Next, use the QUTAssessment applications to interact with the deployed QUTAssessment contract.

 Start  install all required packages:
    npm install
   
   You can run the invoke application as follows.
      node invoke

   You can run the query application as follows. 
      node query

   You can run the update application as follows. 
      node update
Good!!!The QUT Blockchain System is running successfully...

		*******************
		*Congratulations!!*
		*******************

           Welcome to QUT Blockchain System

EOF
