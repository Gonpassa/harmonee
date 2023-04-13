const mongoose = require('mongoose')

const EntrySchema = new mongoose.Schema({
    title: String,
    date: String,
    time: String,
    mood: String,
    entry: String,
    userId: String
    
})

module.exports = mongoose.model('Entry', EntrySchema)