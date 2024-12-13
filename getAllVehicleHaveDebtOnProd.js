import reader from "xlsx";
import axiosClient from "./client/selexProdClient.js";

const file = reader.readFile("./Vehicle_1697078895304.xlsx");

/**
 * lấy sheet Data
 */
const temp = reader.utils.sheet_to_json(file.Sheets["Data"]);
let i = 0;

const handleData = new Promise((resolve, reject) => {
    var data = [];
    temp.forEach(async (res) => {
        try {
            var response = await axiosClient.get(
                `/services/subscriptionservice/api/subscription-data/vehicle/${res.Serial}/have-debt`
            );
            let subs = response.data;
            let debt = 0;
            subs.forEach((sub) => {
                debt += sub.billing.debt;
            });
            i++;
            console.log(i, temp.length, { ...res, debt });
            if (debt > 0) {
                data.push({ ...res, debt });
            }
            if (i == temp.length) {
                resolve(data);
            }
        } catch (error) {
            console.log(error.response.data);
            reject(error);
        }
    });
});

handleData
    .then((data) => {
        console.log("export excel");
        data.sort((a, b) => a.Id - b.Id);

        var ws = reader.utils.json_to_sheet(data);
        if (file.SheetNames.indexOf("have debt")) {
            file.Sheets["have debt"] = ws;
        } else {
            reader.utils.book_append_sheet(file, ws, "have debt");
        }

        reader.writeFile(file, "./Vehicle_1697078895304.xlsx");
    })
    .catch((error) => console.log(error));
