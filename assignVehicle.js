import vehicleClient from "./client/vehicleClient.js";
import fs from "fs";
import { parse } from "csv";

fs.createReadStream("./data/subscription_data.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async function (row) {
        await assignUserToVehicle(row);
        try {
            let response = await vehicleClient.assignUserVehicle(
                "dev3",
                row[1]
            );
            console.log(
                "assign vehicle successfully " + row[1],
                response.status
            );
        } catch (error) {
            console.log("assign vehicle fail " + row[1], error.response.data);
        }
    })
    .on("end", function () {
        console.log("finished");
    })
    .on("error", function (error) {
        console.log(error.message);
    });

async function assignUserToVehicle(row) {
    let vehicleSerial = row[1];
    try {
        let response1 = await vehicleClient.unassignUsersVehicle(vehicleSerial);
        console.log(response1.status);
        console.log("unassign users to th vehicle " + vehicleSerial);
        console.log("successfully!!!");
    } catch (error) {
        if ("error.VEHICLE_NOT_FOUND" == error.response.data.message) {
            console.log("create vehicle");
            let vehicleData = {
                clearance: 0,
                maxPower: 0,
                maxSpeed: 0,
                limitSpeed: 0,
                performanceGrade: 0,
                maxLoad: 0,
                weightTotal: 0,
                maxDistance: 0,
                wheelBase: 0,
                hwVersion: "v1.0",
                swVersion: "v1.0",
                serialNumber: vehicleSerial,
                manufactureDate: "2023-01-01",
                lotNumber: "1",
                color: "random",
                colorCode: "#ccc",
                modelType: "CAMEL",
                licenseNumber: 0,
                frontWheelSize: 0,
                rearWheelSize: 0,
                trunkSize: 0,
                vehicleStatus: "NOT_USED",
            };

            try {
                let createVehicleResponse = await vehicleClient.createVehicle(
                    vehicleData
                );
                console.log("create vehicle ", createVehicleResponse.data);
            } catch (error) {
                console.log("create vehicle fail");
            }
        }
    }
}
