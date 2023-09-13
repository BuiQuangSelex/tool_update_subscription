import fs from "fs";
import { parse } from "csv";
import subscriptionClient from "./client/subscriptionClient.js";
import { time } from "console";

// write file output
let pathFileOutput = "./data/output.csv";
fs.writeFileSync(
    pathFileOutput,
    "regions,vehicle,package_id, package_code, start, end,total cost,deposited,debt,totalCost[sys],deposited[sys],debt[sys]\n"
);

/**
 * totalDeposited: 0,
  totalCost: 2673754,
  totalDebt: 2673754
 */

fs.createReadStream("./data/subscription_data_update_package.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
        try {
            var response =
                await subscriptionClient.getSubscriptionCurrentByVehicle(
                    row[1]
                );
            console.log(
                row[1],
                response.data.totalCost,
                response.data.totalDeposited,
                response.data.totalDebt
            );
            row.push(
                response.data.totalCost,
                response.data.totalDeposited,
                response.data.totalDebt
            );
            fs.appendFileSync(pathFileOutput, `${row.join(",")}\n`);
        } catch (error) {
            console.log(row[1], error.response.data);
        }
    })
    .on("end", function () {
        console.log("finished");
    })
    .on("error", function (error) {
        console.log(error.message);
    });
