import axiosClient from "./index.js";

const batteryClient = {
  getBatteriesOfVehicle: async (vehicleSerial) => {
    return axiosClient.get(
      `/services/batteryservice/api/driver/vehicle/batteries/${vehicleSerial}`
    );
  },
};

export default batteryClient;
