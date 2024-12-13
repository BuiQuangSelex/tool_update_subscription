import { createConnection } from "mysql2";
import xlsx from "xlsx";

const connection = createConnection({
    host: "database-dev.cnxkq4gznhav.ap-southeast-1.rds.amazonaws.com", // MySQL server hostname
    user: "root", // MySQL username
    password: "selex123", // MySQL password
    database: "deviceShadow", // MySQL database name
    port: 3306,
});

fs.createReadStream("./cab_state_data.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        db.serialize(function () {
            db.run(
                `INSERT INTO migration VALUES (?, ?, ? , ?, ?, ?, ?)`,
                [row[0], row[1], row[2], row[3], row[4], row[5], row[6]],
                function (error) {
                    if (error) {
                        return console.log(error.message);
                    }
                    console.log(`Inserted a row with the id: ${this.lastID}`);
                }
            );
        });
    });

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err.message);
        return;
    }
    console.log("Connected to the MySQL server.");

    let query =
        "SELECT serial , " +
        "JSON_EXTRACT(reported_state, '$.cabinet.cabinets.*.op_state') AS \"cab_op_state\", " +
        "\tJSON_EXTRACT(desired_state, '$.cabinet.cabinets') AS \"listState\" " +
        "FROM deviceShadow.device_shadow ds \n" +
        "WHERE \n" +
        "\t`type` = 'BSS'\n" +
        "AND \n" +
        "\tJSON_CONTAINS(JSON_EXTRACT(desired_state, '$.cabinet.cabinets.*.state'),'2','$') = 1;";

    connection.query(query, function (err, result, fields) {
        if (err) throw err;

        result.forEach((element) => {
            let cabState = element.listState;
            const map = new Map(Object.entries(cabState));
            map.forEach((v, k) => {
                console.log({
                    bss: element.serial,
                    cab: k,
                    state: v.state,
                    bp_sn: v.bp_lost_connect,
                });
            });
        });
        connection.end();
    });
});
