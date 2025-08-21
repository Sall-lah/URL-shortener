const mongoose = require('mongoose');

const URLSchema = new mongoose.Schema({
    UID : {
        type: "string",
        required: true,
    },
    source: {
        type: "string",
        required: true,
    }
})

module.exports = mongoose.model('link', URLSchema);