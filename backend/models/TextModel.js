const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
    extractedText: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Text', TextSchema);
