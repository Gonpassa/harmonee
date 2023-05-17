const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const nunjucks = require('nunjucks')
const flash = require('express-flash')
const logger = require('morgan')
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const journalRoutes = require('./routes/journal')
const calendarRoutes = require('./routes/calendar')
const editRoutes = require('./routes/edit')
//Passport config
require('./config/passport')(passport)

require('dotenv').config({path: './config/.env'})

connectDB()

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html')

app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(logger('dev'))
//Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
)
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
//Routes
app.use('/', mainRoutes)
app.use('/journal', journalRoutes)
app.use('/calendar', calendarRoutes)
app.use('/edit', editRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Connected on PORT ${process.env.PORT}`)
})