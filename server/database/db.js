const mongoose = require('mongoose')

exports.connect = function() {

    mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.czmy3sa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,);
    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('Error Connecting to DB:', error);
    });

    db.once('open', () => {
        console.log('Successfully Connected to DB');
    });
    
}