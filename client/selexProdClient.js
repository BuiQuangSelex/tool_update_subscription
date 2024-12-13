import axios from "axios";

var jwtToken =
  "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI5NjQ4Iiwic3ViIjoiYWRtaW4iLCJleHAiOjE2OTc1OTc4Mjl9.ocGWtbicAkikKJkDwJpDXT4hNKZHXZSVFGGGWVUBrlTe3l291CLwKyj9rL1-i6amIq3w5bQ2jNoT3Je-4s4TbQ";

export default axios.create({
  baseURL: "https://api-uat.selex.vn",
  headers: {
    Authorization: "Bearer " + jwtToken,
  },
});
