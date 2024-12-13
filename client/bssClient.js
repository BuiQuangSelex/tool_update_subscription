import axiosClient from "./index.js";

const bssClient = {
  initSwapTransaction: async (bssSerial, bssState) => {
    return await axiosClient.post(
      `/services/bssservice/api/v2/bsses/${bssSerial}/tnx`,
      bssState
    );
  },

  getNewCab: async (transactionId, body) => {
    return await axiosClient.post(
      `/services/bssservice/api/v2/bsses/get-new-cabinet/${transactionId}`,
      body
    );
  },
};

export default bssClient;
