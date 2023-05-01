const mysql = require('mysql2/promise');
const { HOD, MEMBER, EXAMOFFICER, EXAMCONTROLLER } = require('./types');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const connectDB = async () => {
    try {
        await pool.query('SELECT 1 + 1 AS solution');
        console.log("Database connected!");
    } catch (error) {
        console.error("Failed to connect to database:", error);
    }
}

// Middleware to get a connection from the pool for each incoming request
const getConnection = async (req, res, next) => {
    try {
        req.dbConnection = await pool.getConnection();
        next();
    } catch (error) {
        console.error("Failed to get a database connection:", error);
        res.status(500).send("Internal Server Error");
    }
}

// Middleware to release the connection back to the pool after the request is completed
const releaseConnection = async (req, res, next) => {
    try {
        if (req.dbConnection) {
            req.dbConnection.release();
        }
        next();
    } catch (error) {
        console.error("Failed to release the database connection:", error);
        res.status(500).send("Internal Server Error");
    }
}

// User - Queries related to login/signup/deleteUser
const createNewUser = async ({ name, loginid, password, designation, deptName }, conn) => {
    const query = designation === HOD || designation === MEMBER
        ? `INSERT INTO member(name, loginid, password,  designation, deptname) VALUES (?, ?, ?, ?, ?);`
        : designation === EXAMOFFICER || designation === EXAMCONTROLLER
            ? `INSERT INTO examoffice(name, loginid, password,  designation, deptname) VALUES (?, ?, ?, ?, ?);`
            : null;

    if (!query) {
        throw new Error('Invalid designation');
    }

    const [result] = await conn.execute(query, [name, loginid, password, designation, deptName]);
    return result.insertId;
}

// Example endpoint using the getConnection and releaseConnection middlewares
app.post('/users', getConnection, async (req, res) => {
    try {
        const { name, loginid, password, designation, deptName } = req.body;
        const userId = await createNewUser({ name, loginid, password, designation, deptName }, req.dbConnection);
        res.status(201).json({ id: userId });
    } catch (error) {
        console.error("Failed to create a new user:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        releaseConnection(req, res);
    }
});

// Example transaction using the getConnection and releaseConnection middlewares
app.post('/transactions', getConnection, async (req, res) => {
    const conn = req.dbConnection;
    try {
        await conn.beginTransaction();
        // Perform some queries here
        await conn.commit();
        res.status(200).send("Transaction succeeded");
    } catch (error) {
        console.error("Failed to execute a transaction:", error);
        await conn.rollback();
        res.status(500).send("Internal Server Error");
    } finally {
        releaseConnection(req, res);
    }
});
