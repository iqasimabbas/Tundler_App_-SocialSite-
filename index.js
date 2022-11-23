require('express-async-errors');
const error = require('./middleware/error');
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const config = require("config");
const User = require('./routes/user');
const Posts = require('/routes/post');
app.use(express.json());
app.use('/users',User)
app.use('/posts',Posts)
app.use(error);


if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
 }

mongoose
    .connect(config.get('db'))
    .then(() => winston.info("connected to MongoDB..."))
    .catch((err) => console.log("Could not connect to MongoDB..."));

const port = process.env.PORT || 3000;
app.listen(port,()=>console.info(`Listening on port ${port}...`));