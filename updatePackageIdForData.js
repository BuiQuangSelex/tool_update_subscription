import fs from "fs";
import { parse, generate } from "csv";
import subscriptionClient from "./client/subscriptionClient.js";
var pathFileOutput = "./data/subscription_data_update_package.csv";
fs.writeFileSync(
    pathFileOutput,
    "regions,vehicle,package_id,package_code,package_type,start,end\n"
);

// read file data
fs.createReadStream("./data/subscription_data.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        updatePackageIdForData(row);
    })
    .on("end", function () {
        console.log("finished");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

async function updatePackageIdForData(packageRow) {
    try {
        let packageCode = packageRow[2];
        let startDate = formatDateString(packageRow[3]);
        let endDate = formatDateString(packageRow[4]);
        let regions = packageRow[0];
        let vehicleSerial = packageRow[1];
        let packageId = 0;
        let packageType = null;
        let totalCost = packageRow[5];
        let deposited = packageRow[6];
        let debt = packageRow[7];

        let response = await subscriptionClient.getPackageDataByCode(
            packageCode
        );
        if (response.data.length > 0) {
            console.log("package existed", {
                id: response.data[0].id,
                packageCode,
            });
            packageId = response.data[0].id;
            packageType = response.data[0].type;
        }

        let rowData = `${regions},${vehicleSerial},${packageId},${packageCode},${packageType},${startDate},${endDate},${totalCost},${deposited},${debt}\n`;

        fs.appendFileSync(pathFileOutput, rowData);
    } catch (error) {
        console.log(error.response.data);
    }
}

function formatDateString(str) {
    let strArr = str.split("/");
    return `${strArr[2]}-${strArr[0] / 10 < 1 ? `0${strArr[0]}` : strArr[0]}-${
        strArr[1] / 10 < 1 ? `0${strArr[1]}` : strArr[1]
    }`;
}
