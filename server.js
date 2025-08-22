// Configure dotenv
require('dotenv').config();

// Configure Express
const express = require('express');
const port = 3000;
const app = express();

// Configure mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded data

// When database error
db.on('error', (error) => {console.log(error)});
// Once database is connected
db.once('open', () => {console.log("Connected to Database")});

// Let Server accept json
app.use(express.json());

// Setting up Routes when the URL /contacts is called
const contactsRouter = require('./routes/shortenURL.js');
// BTW this is the link to the api => "/shortenURL"
app.use('/api', contactsRouter);

// Start server on port
app.listen(port, () => {
    app.emit('open');
    console.log(`Server is running on port ${port}`);
})