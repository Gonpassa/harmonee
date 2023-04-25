const Entry = require('../models/Entry')
const moment = require('moment')
const dayjs = require('dayjs')
const weekday = require('dayjs/plugin/weekday')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekday)
dayjs.extend(weekOfYear)

exports.getCalendar = async (req, res) => {
    //Numeric value of Month and Year
    const CURRENT_MONTH = dayjs().format('M')
    const CURRENT_YEAR = dayjs().format('YYYY')
    const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
    /* Get entries that match the user that is logged in for the current month */
    const entries = await Entry.find({month: CURRENT_MONTH, year: CURRENT_YEAR, userId: req.user.id})
    /* Day of first day of the month 0(sun) - 6(sat) */
    const  firstDayOfMonth = dayjs().year(CURRENT_YEAR).month(CURRENT_MONTH - 1).startOf('month').day()
    console.log(firstDayOfMonth);
    const numberOfDays = getNumberOfDaysInMonth(CURRENT_YEAR, CURRENT_MONTH)
    if(firstDayOfMonth == 0){
        return  res.render('calendar',
        {user: req.user,
        weekdays: WEEKDAYS,
        month: dayjs().format('MMMM'),
        days: numberOfDays,
        entries: entries,
        title: 'Calendar'
    })
    }else if(firstDayOfMonth == 6){
        return  res.render('calendar',
        {user: req.user,
        weekdays: WEEKDAYS.reverse(),
        month: dayjs().format('MMMM'),
        days: numberOfDays,
        entries: entries,
        title: 'Calendar'
    })
    }
    let week = WEEKDAYS.splice(firstDayOfMonth)
    for(let i = 0; i < WEEKDAYS.length; i++){
        week.push(WEEKDAYS[i])
    }
    res.render('calendar',
    {user: req.user,
    weekdays: week,
    month: dayjs().format('MMMM'),
    days: numberOfDays,
    entries: entries,
    title: 'Calendar'
    })
}

exports.getSpecificMonth = async (req, res) => {
    console.log(req.body.date);
    res.render('journal')
}