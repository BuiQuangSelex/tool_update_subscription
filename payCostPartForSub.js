import fs from "fs";
import { parse } from "csv";
import subscriptionClient from "./client/subscriptionClient.js";
import paymentClient from "./client/paymentServiceClient.js";

fs.createReadStream("./data/subscription_data_update_package.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
        try {
            var response =
                await subscriptionClient.getSubscriptionLastByVehicle(row[1]);

            //todo payment for sub
            let paymentOrderDataPayCostOfSub = {
                type: "PAY_PART_COST_OF_SUB",
                destinationId: response.data.id, //subscriptionId
                user: response.data.user,
                amount: row[8] ? row[8] : 0,
            };

            console.log(paymentOrderDataPayCostOfSub);
            console.log(
                "create payment order for pay cost part the sub",
                response.data.vehicleSerial
            );
            let paymentOrderResponse = await paymentClient.createPaymentOrder(
                paymentOrderDataPayCostOfSub
            );
            console.log(
                "create payment order for pay cost part the sub success"
            );

            await paymentClient.selectPayAsCash(paymentOrderResponse.data.id);

            console.log("select payment method success");
            let paymentOrderDataPayCostOfSubConfirmResponse =
                await paymentClient.paymentStaffConfirm(
                    paymentOrderResponse.data.id,
                    "SUCCESS"
                );
            console.log(
                "pay cost of sub success",
                paymentOrderDataPayCostOfSubConfirmResponse.data.id
            );
            console.log("pay cost of sub success !!!");
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
