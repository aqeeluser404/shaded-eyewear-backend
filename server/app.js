/*
    dependencies
*/
    require('dotenv').config()
    const express = require('express')
    const app = express()
    const mongoose = require('mongoose')
    // const cors = require('cors')
/*
    config
*/
    // app.cors(cors())
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
    const userRoutes = require('./routes/userRoutes')
    app.use(userRoutes);

    const orderRoutes = require('./routes/orderRoutes')
    app.use(orderRoutes)

    const sunglassesRoutes = require('./routes/sunglassesRoutes')
    app.use(sunglassesRoutes)

    const gatewayRoutes = require('./routes/gatewayRoutes')
    app.use(gatewayRoutes)
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
    mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.czmy3sa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,);
    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('Error Connecting to DB:', error);
    });

    db.once('open', () => {
        console.log('Successfully Connected to DB');
    });