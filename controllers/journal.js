const Entry = require('../models/Entry')
const moment = require('moment')

exports.getJournal = (req, res) => {
    return res.render('journal', {user: req.user})
}

exports.addEntry = async (req, res) => {
    try {
        const now = moment().format('h:mm:ss a')
        const formattedDate = moment(req.body.date).format('MMMM Do YYYY')
        const newEntry = await Entry.create({title: req.body.title.trim(), userId: req.user.id, date: formattedDate, entry: req.body.entry.trim(), mood: req.body.mood, time: now})
        console.log('New entry added')
        res.redirect('/journal')
    } catch (err) {
        console.log(err)
    }
}


//When user clicks delete button, make fetch req from client side js, get the entry id, delete it from db. 
exports.removeEntry = async (req,res) => {
    try {
        
    } catch (err) {
        console.log(err)
        
    }
}