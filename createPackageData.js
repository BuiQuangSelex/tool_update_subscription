import fs from "fs";
import { parse } from "csv";
import subscriptionClient from "./client/subscriptionClient.js";

// read file data
fs.createReadStream("./data/package_data.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        createPackageData(row);
    })
    .on("end", function () {
        console.log("finished");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

async function createPackageData(packageRow) {
    let packageCode = packageRow[8];
    try {
        let response = await subscriptionClient.getPackageDataByCode(
            packageCode
        );
        if (response.data.length > 0) {
            console.log("package existed", {
                id: response.data[0].id,
                packageCode,
            });
            return;
        }

        let data = {
            name: packageRow[0],
            description: packageRow[1],
            price: packageRow[2],
            unit: packageRow[3],
            unitCode: packageRow[4],
            km: packageRow[5],
            swapCount: packageRow[6],
            packageDay: packageRow[7],
            code: packageRow[8],
            numberOfPin: packageRow[9],
            swapLimit: packageRow[10],
            distanceLimit: packageRow[11],
            priceExceedDistanceLimit: packageRow[12],
            priceExceedSwapLimit: packageRow[13],
            type: packageRow[14],
            packageTimeUnit: packageRow[15],
            savingPercent: packageRow[16],
            end: packageRow[17],
            start: packageRow[18],
            renewalAuto: packageRow[19],
        };

        // post http request: create packageData
        let createResponse = await subscriptionClient.createPackageData(data);
        console.log("create package: ", packageCode);
        console.log(createResponse.status);
        console.info("create successfully !!!");
    } catch (error) {
        console.log(error);
    }
}
