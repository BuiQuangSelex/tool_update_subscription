import deviceShadowClient from "./client/deviceShadowClient.js";
import batteryClient from "./client/batteryClient.js";
import bssClient from "./client/bssClient.js";
import swapClient from "./client/swapClient.js";

// đầu vào : trạm có pin khả dụng
// xe phải có thuê bao và có pin được gán
var bssSerialNumber = "bss_v1.0_0110";
var vehicleSerial = "RCDE0035";

const generateNewBssState = (oldCab, oldBat, newCab) => {
  return `{"cabinet": {
              "cabinets": {
                "${oldCab}": { "battery": {"connected": 1, "soc": 90, "sn": "${oldBat}"} },
                "${newCab}": { "battery": {"connected": 0, "soc": 0, "sn": ""} }
              }
            }}`;
};

(async () => {
  let bssState;
  let batteriesSerial;
  let transactionId;
  let oldCab;
  let oldBat;
  let newCab;
  let newBat;

  // get shadow bss
  try {
    let reportedStateResponse = await deviceShadowClient.getReportedState(
      bssSerialNumber
    );
    console.log("1 => get bss state ...");
    bssState = reportedStateResponse.data;
    await timeout(500);
    console.log(`get bss ${bssSerialNumber} state success`);
    console.log("---------------");
  } catch (error) {
    console.error("get shadow bss", error.response.data);
    return;
  }

  // get battery of vehicle
  try {
    console.log("2 => Get battery of vehicle ...");
    await timeout(500);
    let batteriesResponse = await batteryClient.getBatteriesOfVehicle(
      vehicleSerial
    );
    batteriesSerial = batteriesResponse.data.map((b) => b.serialNumber);
    console.log(
      `battery of vehicle success: ${vehicleSerial}`,
      batteriesSerial
    );
    oldBat = batteriesSerial[0];
    if (oldBat == null) {
      console.log("Vehicle not assigned battery");
      return;
    }
    console.log("---------------");
  } catch (error) {
    console.log("get battery of vehicle error", error.response.data);
    return;
  }

  // call api tnx
  try {
    console.log("3 => Init swap transaction ...");
    await timeout(500);
    let tnxResponse = await bssClient.initSwapTransaction(
      bssSerialNumber,
      bssState
    );

    let data = tnxResponse.data;
    console.log("response <= ", data);
    transactionId = data.transactionId;
    oldCab = data.availableCabinetId;
    console.log("---------------");
  } catch (error) {
    console.log("init swap transaction tnx", error.response.data);
    return;
  }

  // get new cabinet
  try {
    let requestBody = {
      transactionId: transactionId,
      bssSerial: bssSerialNumber,
      oldBatSerial: oldBat,
      oldBatSoc: 10,
    };

    console.log("4 => Get new cabinet ...", requestBody);
    await timeout(500);

    let response = await bssClient.getNewCab(transactionId, requestBody);
    let data = response.data;
    newCab = data.availableCabinetId;
    newBat = data.batterySerial;
    console.log("response <= ", data);
    console.log("---------------");
  } catch (error) {
    console.log("Get new cabinet error", error.response.data);
    return;
  }

  // swap confirm
  try {
    console.log("5 => Swap confirm ...");
    console.log(
      "=> ",
      (transactionId, generateNewBssState(oldCab, oldBat, newCab))
    );

    await timeout(500);
    let response = await swapClient.swapConfirm(
      transactionId,
      JSON.parse(generateNewBssState(oldCab, oldBat, newCab))
    );
    console.log("response <=", response.data);
    console.log("-------------------");
  } catch (error) {
    console.log("swap confirm error", error.response.data);
    return;
  }

  // set battery-delivery successful (clear state = 3)
  try {
    console.log("6 => battery-delivery successful (clear state = 3) ...");
    await timeout(1000);
    let response = await swapClient.batteryDeliverySuccessful(transactionId);
    console.log("response <=", response.status);
    console.log("-------------------");
  } catch (error) {
    console.log("battery-delivery successful (clear state = 3) error", error);
    return;
  }
})();

const timeout = (millisecond) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("done.");
    }, millisecond);
  });
};
