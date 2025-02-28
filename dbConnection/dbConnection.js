const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/DemoLogicBinary', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('Database connection successful');
    }
    catch (error) {
        console.error('Database connection error:', error);
    }
}


module.exports = dbConnection;