import axios from "axios";

var jwtToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1OTk5Iiwic3ViIjoiYWRtaW4iLCJleHAiOjE2OTQ1NzEyMjF9.j-02y0YbuhH090zd_FCBddoyAfPD2GfjcOuRU6pDqCMoSUBTv8r8HlXjvn7pGNiLAa1ZcI1Tt9Q9L3GL3QClCw";

export default axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Authorization: "Bearer " + jwtToken,
    },
});
