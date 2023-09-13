import fs from "fs";
import { parse, generate } from "csv";
import subscriptionClient from "./client/subscriptionClient.js";
var pathFileOutput = "./data/subscription_data_update_package.csv";
fs.writeFileSync(
    pathFileOutput,
    "regions,vehicle,package_id,package_code,start,end\n"
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
        let packageCode = packageRow[3];
        packageRow[4] = formatDateString(packageRow[4]);
        packageRow[5] = formatDateString(packageRow[5]);

        let response = await subscriptionClient.getPackageDataByCode(
            packageCode
        );
        if (response.data.length > 0) {
            console.log("package existed", {
                id: response.data[0].id,
                packageCode,
            });
            packageRow[2] = response.data[0].id;
        }

        let rowData = packageRow.join(",");
        console.log(packageRow.join(","));
        fs.appendFileSync(pathFileOutput, `${rowData}\n`);
    } catch (error) {
        console.log(error);
    }
}

function formatDateString(str) {
    let strArr = str.split("/");
    return `${strArr[2]}-${strArr[0] / 10 < 1 ? `0${strArr[0]}` : strArr[0]}-${
        strArr[1] / 10 < 1 ? `0${strArr[1]}` : strArr[1]
    }`;
}
