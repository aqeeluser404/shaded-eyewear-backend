// dependencies ----------------------------------------------------------------------------------
require('dotenv').config()
const express = require('express')
const app = express()
const compression = require('compression')
const db = require('./database/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
const { checkTokens } = require('./middleware/authentication');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');

app.use(morgan('dev'))
app.use(compression())
app.use(cookieParser())
app.use(express.json())

// required to access images on frontend for (development purposes)
// const path = require('path');
// const uploadsDir = path.join(__dirname, './uploads')
// app.use('/uploads', express.static(uploadsDir))

// cors config
const corsOptions = {
    origin: process.env.HOST_LINK, // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true   // cookie config
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.get('/get-token', (req, res) => {
    const token = req.cookies.token;  // Assuming cookie is named "token"
    if (!token) {
        return res.status(401).json({ message: 'No token found in cookie' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ token });  // Send back the token
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
})
// Route to remove the token (clear cookie)
app.post('/remove-token', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', { httpOnly: true, secure: isProduction, sameSite: 'Lax', path: '/' });
    res.send({ message: 'Token removed' });
})

cron.schedule('*/10 * * * *', () => {
    console.log('Running token check every ten minutes');
    checkTokens()
})


// routes --------------------------------------------------------------------------------------
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
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' })
})

// user routes
const routes = [
    require('./routes/userRoutes'),
    require('./routes/orderRoutes'),
    require('./routes/sunglassesRoutes'),
    require('./routes/gatewayRoutes'),
    require('./routes/emailRoutes'),
    require('./routes/shippingRoutes')
]
routes.forEach(route => {
    app.use(route)
})


// backend start -------------------------------------------------------------------------------
app.listen(process.env.PORT, function check(error) {
    if (error) {
        console.log("An error has occurred");
    } else {
        console.log("Started server");
    }
})

db.connect()

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})