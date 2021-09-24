//const { response } = require('express');
require('dotenv').config();

const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');

const routes = require('./routes/main');
const passwordRoutes = require('./routes/password');

const app = express();
const port = process.env.PORT || 3000;

// Updating express settings
app.use(express.urlencoded({extended: false})); // parse application/x-www-form-urlendcoded
app.use(express.json()); // parse application/json
app.use(cookieParser());
app.use(cors({credentials: true, origin: process.env.CORS_ORIGIN}));

// Require passport auth
require('./auth/auth');

//setup routes
app.use('/', routes);
app.use('/', passwordRoutes);

// If there is a request that doesnt match to the other request, so this method will catch all other routes
app.use((request, response) => {
    response.status(404).json({ message: '404 - Not Found', status: 404});
});

// handle errors
app.use((error, request, response, next) => {
    console.log(error);
    response.status(error.status || 500).json({ message: error.message, status: 500});
});

// Entry point
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});