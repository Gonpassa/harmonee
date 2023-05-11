const Entry = require('../models/Entry')
const moment = require('moment')
const dayjs = require('dayjs')
const weekday = require('dayjs/plugin/weekday')
const weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekday)
dayjs.extend(weekOfYear)

function getNumberOfDaysInMonth(year,month){
    return dayjs(`${year}-${month}-01`).daysInMonth()
}

exports.getCalendar = async (req, res) => {
    //Numeric value of Month and Year
    const CURRENT_MONTH = dayjs().format('M')
    const CURRENT_YEAR = dayjs().format('YYYY')
    const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    /* Get entries that match the user that is logged in for the current month */
    const entries = await Entry.find({month: CURRENT_MONTH, year: CURRENT_YEAR, userId: req.user.id})
    /* Day of first day of the month 0(sun) - 6(sat) */
    const  firstDayOfMonth = dayjs().year(CURRENT_YEAR).month(CURRENT_MONTH - 1).startOf('month').day()
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
    try{
    const date = req.body.date
    console.log(date);
    const MONTH = dayjs(date).format('M')
    console.log(dayjs(date).format('MMMM'));
    const YEAR = dayjs(date).format('YYYY')
    const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


    const entries = await Entry.find({month: MONTH, year: YEAR, userId: req.user.id})

    const  firstDayOfMonth = dayjs().year(YEAR).month(MONTH - 1).startOf('month').day()

    const numberOfDays = getNumberOfDaysInMonth(YEAR, MONTH)
    if(firstDayOfMonth == 0){
        return  res.render('calendar',
        {user: req.user,
        weekdays: WEEKDAYS,
        month: dayjs(date).format('MMMM'),
        days: numberOfDays,
        entries: entries,
        title: 'Calendar'
    })
    }else if(firstDayOfMonth == 6){
        return  res.render('calendar',
        {user: req.user,
        weekdays: WEEKDAYS.reverse(),
        month: dayjs(date).format('MMMM'),
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
    month: dayjs(date).format('MMMM'),
    days: numberOfDays,
    entries: entries,
    title: 'Calendar'
    })
    } catch(err){
        console.log(err);
    }
}