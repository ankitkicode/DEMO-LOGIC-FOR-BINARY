require('dotenv').config();
const express = require('express');
const app = express();
const dbConnection = require('./dbConnection/dbConnection');
const port = process.env.PORT || 3000;

dbConnection();

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the application.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})





