const seedingQuery = "";

const mysql = require('mysql2/promise');

/**
* @type {mysql.Connection}
*/
let sqlDatabase = null;

const connectDB = async () => {
    sqlDatabase = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    console.log("DataBase Connected !!!");
}

const seed = async () => {
    await connectDB();
    await sqlDatabase.execute(seedingQuery);
    console.log("Seeding Completed !!!");
}

seed();
