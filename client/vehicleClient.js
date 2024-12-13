import axiosClient from "./index.js";

const vehicleClient = {
  unassignUsersVehicle: async (serialNumber) => {
    return axiosClient.post(
      `/services/vehicleservice/api/driver/remove-vehicle/${serialNumber}`
    );
  },

  assignUserVehicle: async (user, serialNumber) => {
    return axiosClient.post("/services/vehicleservice/api/driver/add-vehicle", {
      user,
      serialNumber,
    });
  },

  createVehicle: async (vehicleData) => {
    return axiosClient.post(
      "/services/vehicleservice/api/vehicles",
      vehicleData
    );
  },
};

export default vehicleClient;
