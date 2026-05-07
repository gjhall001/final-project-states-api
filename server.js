require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
//const states = require('./model/State');
//const test = require('./middleware/verifyStates');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;
// const corsOptions = require('./config/corsOptions');

// Connect to MongoDB
connectDB();

//const whiteList = ['https://google.com', '']
// Cross-Origin Resource Sharing
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
app.use(express.json());

// serve static files
// app.use(express.static())

// routes
app.use('/', require('./routes/root'));
app.use('/states', require('./routes/states'));

app.use((req, res) => {

    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    }
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});