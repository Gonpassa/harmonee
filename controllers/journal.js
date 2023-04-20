const Entry = require('../models/Entry')
const moment = require('moment')
const dayjs = require('dayjs')
const weekday = require('dayjs/plugin/weekday')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekday)
dayjs.extend(weekOfYear)

exports.getJournal = (req, res) => {
    return res.render('journal', {user: req.user})
}

exports.addEntry = async (req, res) => {
    try {
        const now = moment().format('h:mm:ss a')
        const formattedDate = dayjs(req.body.date).format('MM-DD-YYYY')
        const newEntry = await Entry.create({title: req.body.title.trim(), userId: req.user.id, date: formattedDate, entry: req.body.entry.trim(), mood: req.body.mood, time: now})
        console.log('New entry added')
        res.redirect('/journal')
    } catch (err) {
        console.log(err)
    }
}



exports.getCalendar = async (req, res) => {
    //Numeric value of Month and Year
    const CURRENT_MONTH = dayjs().format('M')
    const CURRENT_YEAR = dayjs().format('YYYY')
    const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    function getNumberOfDaysInMonth(year,month){
        return dayjs(`${year}-${month}-01`).daysInMonth()
    }
    function createDaysForCurrentMonth(year, month) {
        return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
          return {
            date: dayjs(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD"),
            dayOfMonth: index + 1,
            isCurrentMonth: true
          };
        });
    }
    const numberOfDays = getNumberOfDaysInMonth(CURRENT_YEAR, CURRENT_MONTH)
    console.log(numberOfDays);
    res.render('calendar',
    {user: req.user,
    weekdays: WEEKDAYS,
    month: dayjs().format('MMMM'),
    days: numberOfDays,
})
}
