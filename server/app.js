/*
    dependencies
*/
    require('dotenv').config()
    const express = require('express')
    const app = express()
    const compression = require('compression')
    const db = require('./database/db')
/*
    config
*/
    app.use(compression())
    app.use(express.json())
/*
    middleware
*/
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        next();
    });
/*
    endpoints
*/
    app.get('/', (req, res) => {
        res.send('Backend is running');
    });

    const routes = [
        require('./routes/userRoutes'),
        require('./routes/orderRoutes'),
        require('./routes/sunglassesRoutes'),
        require('./routes/gatewayRoutes')
    ];

    routes.forEach(route => {
        app.use(route);
    });
/*
    listen
*/
    app.listen(process.env.PORT, function check(error) {
        if (error) {
            console.log("An error has occurred");
        } else {
            console.log("Started server");
        }
    });
/*
    mongodb config
*/
    db.connect();

    // error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });