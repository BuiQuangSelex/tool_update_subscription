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
            `/services/subscriptionservice/api/v2/driver/subscription-data/vehicle/${vehicleSerial}/current`
        );
    },

    getSubscriptionLastByVehicle: async (vehicleSerial) => {
        return client.get(
            `/services/subscriptionservice/api/v2/driver/subscription-data/vehicle/${vehicleSerial}/last`
        );
    },

    cancelSubscriptionData: async (subId) => {
        return client.patch(
            `/services/subscriptionservice/api/v2/subscription-data/${subId}/status?status=CANCELLED`
        );
    },
};

export default subscriptionClient;
