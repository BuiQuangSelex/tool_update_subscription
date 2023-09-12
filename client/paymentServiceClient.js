import axiosClient from "./index.js";

const paymentClient = {
    createPaymentOrder: async (body) => {
        return axiosClient.post(
            "/services/paymentservice/api/v2/payment-orders/create-for-users",
            body
        );
    },

    selectPayAsBanking: async (paymentId) => {
        return axiosClient.put(
            `/services/paymentservice/api/v2/payment-orders/${paymentId}/pay-as-banking`
        );
    },

    selectPayAsCash: async (paymentId) => {
        return axiosClient.put(
            `/services/paymentservice/api/v2/payment-orders/${paymentId}/pay-as-cash`
        );
    },

    selectPayAsOnePay: async (paymentId) => {
        return axiosClient.put(
            `/services/paymentservice/api/v2/payment-orders/${paymentId}/pay-as-onepay`
        );
    },

    paymentStaffConfirm: async (paymentId, status) => {
        return axiosClient.put(
            `/services/paymentservice/api/v2/payment-orders/${paymentId}/staff-confirm/${status}`
        );
    },
};

export default paymentClient;
