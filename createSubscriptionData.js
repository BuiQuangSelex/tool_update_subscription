import fs from "fs";
import { parse } from "csv";
import paymentClient from "./client/paymentServiceClient.js";

fs.createReadStream("./data/subscription_data.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
        createSubscriptionData(row);
    })
    .on("end", function () {
        console.log("finished");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

async function createSubscriptionData(row) {
    let paymentOrderData = {
        type: "BUY_NEW_PACKAGE",
        destinationId: row[2],
        vehicleSerial: row[1],
        userRenewal: true,
        startDate: row[4],
        expiredDate: row[5],
        user: "dev3",
        pain: false,
    };

    try {
        let paymentOrderDataResponse = await paymentClient.createPaymentOrder(
            paymentOrderData
        );
        console.log("create payment order success");
        let selectPayAsCashResponse = await paymentClient.selectPayAsCash(
            paymentOrderDataResponse.data.id
        );
        console.log("select payment method success");
        let confirmResponse = await paymentClient.paymentStaffConfirm(
            paymentOrderDataResponse.data.id,
            "SUCCESS"
        );
        console.log("confirm response success", confirmResponse.data);
        console.log("create subscription success !!!");
        console.log("-----------------------------------");
    } catch (error) {
        console.error(error.response.data);
        console.log("create subscription failed", row[1]);
        console.log("-----------------------------------");
    }
}
