import axiosClient from "./index.js";

const deviceShadowClient = {
  getReportedState: async (deviceSerial) => {
    return axiosClient.get(
      `/services/deviceshadow/api/device-shadows/${deviceSerial}/get-reported-state`
    );
  },
};

export default deviceShadowClient;
