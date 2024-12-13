import axiosClient from "./index.js";

const swapClient = {
  swapConfirm: async (transactionId, bssState) => {
    return axiosClient.put(
      `/services/swapservice/api/v2/driver/swap-orders/${transactionId}`,
      bssState
    );
  },
  batteryDeliverySuccessful: async (transactionId) => {
    return axiosClient.put(
      `/services/swapservice/api/v2/driver/swap-orders/${transactionId}/battery-delivery/successful`
    );
  },
};

export default swapClient;
