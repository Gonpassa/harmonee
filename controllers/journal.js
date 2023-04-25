const Entry = require('../models/Entry')
const moment = require('moment')
const dayjs = require('dayjs')
const weekday = require('dayjs/plugin/weekday')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekday)
dayjs.extend(weekOfYear)

exports.getJournal = (req, res) => {
    return res.render('journal', {user: req.user, title: 'Journal'})
}

exports.addEntry = async (req, res) => {
    try {
        const now = moment().format('h:mm:ss a')
        const formattedDate = dayjs(req.body.date).format('MM-DD-YYYY')
        const date = formattedDate.split('-')
        console.log(date)
        const newEntry = await Entry.create({title: req.body.title.trim(), userId: req.user.id, month: date[0], day: date[1], year: date[2], entry: req.body.entry.trim(), mood: req.body.mood, time: now})
        console.log('New entry added')
        res.redirect('/journal')
    } catch (err) {
        console.log(err)
    }
}



