#! /bin/bash

echo "1. Create subscription"
node ./createPackageData.js

echo "update packageId for data"
node ./updatePackageidForData.js

echo "update assign vehicle for user"
node ./assignVehicle.jS

echo "cancel sub current in vehicle"
node cancelSubscriptionCurrent.js

echo "create subscription"
node ./createSubscriptionData.js

echo "pay part cost for sub"
node ./payCostPartForSub.js

echo "export subscription info to csv file"
node ./writeCsv.js