import axios from "axios";

export default axios.create({
  baseURL: "http://api-uat.selex.vn",
  headers: {
    Authorization: `Bearer ${process.env.JWT_TOKEN}`,
  },
});
