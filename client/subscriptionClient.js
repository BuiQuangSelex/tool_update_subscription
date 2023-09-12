import client from "./index.js";

const subscriptionClient = {
    getPackageDataByCode: async (code) => {
        return client.get(
            `/services/subscriptionservice/api/package-data/code/${code}`
        );
    },

    createPackageData: async (packageData) => {
        return client.post(
            "/services/subscriptionservice/api/package-data",
            packageData
        );
    },

    getSubscriptionCurrentByVehicle: async (vehicleSerial) => {
        return client.get(
            `/services/subscriptionservice/api/driver/subscription-data/vehicle/${vehicleSerial}/current`
        );
    },

    cancelSubscriptionData: async (subId) => {
        return client.patch(
            `/services/subscriptionservice/api/subscription-data/${subId}/status?status=CANCELLED`
        );
    },
};

export default subscriptionClient;
