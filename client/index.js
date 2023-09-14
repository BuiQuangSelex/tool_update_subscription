import axios from "axios";

var jwtToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI2MDA0Iiwic3ViIjoiYWRtaW4iLCJleHAiOjE2OTQ3MjAyNzl9.0g_1WF3njTChbH2ci1GpVtnYZSEUxVUgCA7SgJCnixZ-lkXS5ROtna_TH6xxjlcIGW30Hq6YkELsXvnS_SznDQ";

export default axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Authorization: "Bearer " + jwtToken,
    },
});
