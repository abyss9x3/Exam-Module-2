const mysql = require('mysql2/promise');
const path = require('path');
const { exit } = require('process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    waitForConnections: true,
    connectionLimit: 10
});

const connectDB = async () => {
    await pool.query('SELECT 1 + 1 AS solution');
    console.log("Database connected!");
}

const disconnectDB = async () => {
    await pool.end();
    console.log("Database disconnected!");
}

/**
 * @callback Queries
 * @param {mysql.PoolConnection} connection
 * @returns {Promise<>}
 */

/**
 * Executes a transaction by calling the provided queries function with a MySQL connection,
 * and commits or rolls back the transaction based on the success of the queries.
 * 
 * @param {Queries} queries - The queries to execute as a transaction
 * @returns {Promise<void>} - Resolves if the transaction was successful, rejects if it failed
 */
const transactionWrapper = async queries => {
    /** @type {mysql.PoolConnection} */
    let connection = null;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const response = await queries(connection);

        await connection.commit();
        return response;
    } catch (error) {
        if (connection) {
            await connection.rollback();
            throw new Error(error.message);
        } else {
            throw new Error("Failed to get a database connection: " + error.message);
        }
    } finally {
        try {
            if (connection) connection.release();
        } catch (error) {
            throw new Error("Failed to release the database connection: " + error.message);
        }
    }
}

const main = async () => {
    try {
        await connectDB();

        const res = await Promise.all([
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(2)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(1)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(3)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(3)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(5)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(3)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(5)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(3)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(3)");
            }),
            transactionWrapper(async connection => {
                return await connection.execute("select sleep(5)");
            })
        ]);

    } catch (error) {
        console.log(error);
    } finally {
        await disconnectDB();
    }
}

const Timer = name => {
    const start = performance.now();
    return {
        stop: () => {
            const end = performance.now();
            const time = end - start;
            console.log('Timer:', name, 'finished in', time, 'ms');
        }
    }
};

const benchMark = async () => {
    const timer = Timer("t1");
    await main();
    timer.stop();
}

benchMark().finally(exit);
