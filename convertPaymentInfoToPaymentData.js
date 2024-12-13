import { createConnection } from "mysql2";

const connection = createConnection({
    host: "localhost", // MySQL server hostname
    user: "root", // MySQL username
    password: "root", // MySQL password
    database: "paymentservice", // MySQL database name
    port: 3306,
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
    }
    console.log("Connected to the MySQL server.");

    let query =
        "select * from payment_order po where po.order_type = 'PAY_CREATE_SUBSCRIPTION' order by id desc limit 100 OFFSET 0";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;

        result.forEach((element) => {
            let subInfoV1 = JSON.parse(element.info);
            let subInFoV2 = [
                {
                    name: subInfoV1?.name,
                    packageDataType: subInfoV1?.packageDataType,
                    packageCode: subInfoV1?.packageCode,
                    priceOfPackage: subInfoV1?.priceOfPackage,
                    registerDay: subInfoV1?.registerDay,
                    endDay: subInfoV1?.endDay,
                    user: subInfoV1?.user,
                    vehicleSerial: subInfoV1?.vehicleSerial,
                },
            ];
            console.log(
                element.order_type,
                JSON.stringify({ subscriptions: subInFoV2 })
            );
        });
        connection.end();
    });
});
