const Mongoose = require('mongoose');
const dotenv = require('dotenv');
const e = require('express');
dotenv.config();
const DBURL = process.env.DBURL;

const connectDB = async () => {
    try {
        await Mongoose.connect(DBURL);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;