import axios from "axios";

var jwtToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI2MDAxIiwic3ViIjoiYWRtaW4iLCJleHAiOjE2OTQ2NTgwNzN9.Ve288MUHT6MVK0HTSmCyB5McSIANuVQdq0tWWwf_wovFLcc02h52IpdAPvSRw5LFhAE_aGkkYy2oi9y8hsx3Sw";

export default axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Authorization: "Bearer " + jwtToken,
    },
});
