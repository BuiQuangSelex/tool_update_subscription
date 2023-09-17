import fs from "fs";
import { parse } from "csv";
import paymentClient from "./client/paymentServiceClient.js";

fs.createReadStream("./data/subscription_data_update_package.csv")
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
    let paymentOrderDataCreate = {
        type: "BUY_NEW_PACKAGE",
        destinationId: row[2],
        vehicleSerial: row[1],
        userRenewal: false,
        startDate: row[5],
        expiredDate: row[6],
        user: "dev3",
        pain: false,
    };

    try {
        let paymentOrderDataCreateResponse =
            await paymentClient.createPaymentOrder(paymentOrderDataCreate);
        console.log("create payment order success");
        await paymentClient.selectPayAsCash(
            paymentOrderDataCreateResponse.data.id
        );
        console.log("select payment method success");
        let confirmResponse = await paymentClient.paymentStaffConfirm(
            paymentOrderDataCreateResponse.data.id,
            "SUCCESS"
        );
        console.log("confirm response success", confirmResponse.data.id);
        console.log("create subscription success !!!");

        console.log("-----------------------------------");
    } catch (error) {
        console.error(error.response.data);
        console.log("create subscription failed", row[1]);
        console.log("-----------------------------------");
    }
}
