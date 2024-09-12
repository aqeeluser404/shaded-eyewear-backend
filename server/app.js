/*
    dependencies
*/
    require('dotenv').config()
    const express = require('express')
    const app = express()
    const compression = require('compression')
    const db = require('./database/db')
    const cors = require('cors')
    const morgan = require('morgan')
/*
    config
*/
    app.use(morgan('dev'))
    app.use(compression())
    app.use(express.json())

    // required to access images on frontend for (development purposes)
    const path = require('path');
    const uploadsDir = path.join(__dirname, './uploads');
    app.use('/uploads', express.static(uploadsDir));
/*
    middleware
*/
    app.use(cors({
        origin: 'http://localhost:9000', // Allow requests from your frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    }));
/*
    endpoints
*/
    app.get('/', (req, res) => {
        res.send('Backend is running');
    })
    app.get('/payment-success', (req, res) => {
        res.send('Payment was successful!')
    })
    app.get('/payment-cancel', (req, res) => {
        res.send('Payment was canceled.')
    })
    app.get('/payment-failure', (req, res) => {
        res.send('Payment failed. Please try again.')
    })

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