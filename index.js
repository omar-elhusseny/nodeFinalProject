require('dotenv').config();
const express = require('express');
const session = require('express-session');
const authRoutes = require("./routes/auth_users.js");
const generalRoutes = require('./routes/general.js');

const app = express();
app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        message: error.message,
        code: error.statusCode || 500,
        data: null
    });
})

app.use("/customer", authRoutes);
app.use("/", generalRoutes);

app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));
