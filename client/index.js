import axios from "axios";

var jwtToken =
    "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI2MDA1Iiwic3ViIjoiYWRtaW4iLCJleHAiOjE2OTczMzcwOTN9.N-B-pD0OZyoNFDKgGduRcoLsqR_R9gtydrJhPT7Tyu5RGqmJLkXMnovb4j60a2h2wbxJXu7ERvx4MArcWstaEg";

export default axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Authorization: "Bearer " + jwtToken,
    },
});
