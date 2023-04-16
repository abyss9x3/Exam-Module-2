// If not in production
if (process.env.NODE_ENV !== "production")
    require('dotenv').config(); // .env file variables -> process.env
console.log(`In ${process.env.NODE_ENV} env !`);

const express = require('express');
const app = express();
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const user = require('./routes/user');

// Establish Connection to Database
const { connectDB } = require('./DataBase');
connectDB();

// parse json request body
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(cors({ origin: true, credentials: true }));
app.use(mongoSanitize());
app.use(hpp());
app.use(helmet());
app.use(rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Minutes
    max: 500
}));


// api route for user login and register
app.use('/api/user', user);


// Serve Static Assets In Production
// if (process.env.NODE_ENV === "production") {
// Set Static Folder
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
);
// }

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
