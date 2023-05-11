const Entry = require('../models/Entry')
const moment = require('moment')
const dayjs = require('dayjs')
const weekday = require('dayjs/plugin/weekday')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekday)
dayjs.extend(weekOfYear)

exports.getJournal = async (req, res) => {
    try {
        const entries = await Entry.find({userId: req.user.id}).sort({year: -1, month: -1, day: -1}).lean()
        console.log(entries);
        return res.render('journal', {user: req.user, title: 'Journal', entries: entries})
    } catch (err) {
        console.log(err);
    }
}

exports.newEntry = (req, res) => {
    return res.render('newEntry', {user: req.user, title: 'New Entry'})
}

exports.addEntry = async (req, res) => {
    try {
        const now = moment().format('h:mm:ss a')
        const formattedDate = dayjs(req.body.date).format('MM-DD-YYYY')
        const date = formattedDate.split('-')
        //Check if any existing entries for date
        const count = await Entry.countDocuments({month: date[0], day: date[1], year: date[2] })
        if(count != 0){
            return res.render('newEntry', {user: req.user, title: 'Journal', errorMessage: 'Already submitted an entry for that date, please delete entry on that date, or pick a different date'})
        }
        const newEntry = await Entry.create({title: req.body.title.trim(), userId: req.user.id, month: date[0], day: date[1], year: date[2], entry: req.body.entry.trim(), mood: req.body.mood, time: now})
        console.log('New entry added')
        res.redirect('/journal')
    } catch (err) {
        console.log(err)
    }
}

exports.getSpecificEntry = async (req, res) => {
    const entryId = req.params.id
    try {
        const entry = await Entry.findById(entryId).lean()
        res.json(entry)
    } catch (err) {
        console.log(err);
    }
}

exports.deleteEntry = async (req,res) => {
    const id  = req.params.id
    try {
        await Entry.findOneAndDelete({_id: id})
        res.json(`Entry ${id} deleted`)
    } catch (err) {
        console.log(err);
    }
}



