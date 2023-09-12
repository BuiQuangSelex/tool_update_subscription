import fs from "fs";
import { parse } from "csv";
import subscriptionClient from "./client/subscriptionClient.js";

fs.createReadStream("./data/subscription_data.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
        cancelSubscriptionData(row);
    })
    .on("end", function () {
        console.log("finished");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

async function cancelSubscriptionData(row) {
    let vehicleSerial = row[1];
    try {
        let subscriptionDataCurrentResponse =
            await subscriptionClient.getSubscriptionCurrentByVehicle(
                vehicleSerial
            );
        console.log(subscriptionDataCurrentResponse.data.id);
    } catch (error) {
        console.log("cancel failed vehicle " + vehicleSerial);
        console.error(error.response.data);
    }
}
