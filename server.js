const express = require('express')
const app = express()
const mongoose = require('mongoose')
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

//Passport config
require('./config/passport')(passport)

require('dotenv').config({path: './config/.env'})

connectDB()

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html')

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


app.listen(process.env.PORT, () => {
    console.log(`Connected on PORT ${process.env.PORT}`)
})

/* const startServer = async () => {
    //Connect to the database, wait for it
    try {
        const client = await MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})

        //Name database
        const db = client.db('harmonee')
        console.log('Connected')

        //create collection of users
        const users = db.collection('users')
        //use body parser before anything else
        app.use(express.urlencoded({extended: true}))

        //Make server accept JSON data
        app.use(express.json())

        //Session
        app.use(session({
            secret: secret,
            resave: false,
            saveUninitialized: false
        }))

        //serve static files, literally just use this with the directory NAME NOT PATH and css and js automagically loaded
        app.use(express.static('public'))
        const templateDir = __dirname + '/views'

        //Configure nunjucks
        nunjucks.configure(templateDir, {
            autoescape: true,
            express: app
        })

        app.get('/', (req, res)=> {
            if(req.session.username){
                return res.render(templateDir + '/template.html', {username: req.session.username})
            }
            res.render(templateDir + '/index.html')
        })

        //Profile
        app.get('/profile', (req,res)=>{
            if(!req.session.username){
                res.redirect('/register')
            }
            res.render(templateDir + '/profile.html', {username: req.session.username})
        })

        //login
        app.get('/login', (req, res)=>{
            res.render(templateDir + '/login.html')
        })

        //Log in user authentication
        app.post('/login', async (req,res)=>{
            //See if username in 
            const user = await users.findOne({username: req.body.username})
            if(!user){
                const errorMessage = 'Username not in file'
                return res.render(templateDir + '/login.html', {errorMessage: errorMessage})
            }
            const match = await bcrypt.compare(req.body.password, user.password)

            if(!match){
                const errorMessage = 'Username exists but does not match password'
                return res.render(templateDir + '/login.html', {errorMessage: errorMessage})
            }
            //start session
            req.session.username = user.username
            res.redirect('/profile')
        })

        //register
        app.get('/register', (req,res) => {
            res.render(templateDir + '/register.html')
        })

        app.post('/register', async (req, res)=>{
            //Check if a username or email already exist in the database
            const existingUser = await users.findOne({$or: [{username: req.body.username.toLowerCase()}, {email: req.body.email.toLowerCase()}]})
            if(existingUser){
                let  errorMessage;
                if(existingUser.username === req.body.username.toLowerCase()){
                     errorMessage = 'Username already taken'
                    return res.render(templateDir + '/register.html', {errorMessage: errorMessage})
                }else if((existingUser.email === req.body.email.toLowerCase()) && (req.body.email !== '')){
                     errorMessage = 'Email already taken'
                    return res.render(templateDir + '/register.html', {errorMessage: errorMessage})
                }
            }
            //If username and email unique hash password and create new user in db
            const salt =  bcrypt.genSaltSync(saltRounds)
            const hash =  bcrypt.hashSync(req.body.password, salt)
            let newUser = {
                username: req.body.username.toLowerCase(),
                password: hash,
                email: req.body.email.toLowerCase()
            }
            await users.insertOne(newUser)
            res.redirect('/login')
        })




        //Start server here
        app.listen(PORT, function(){
            console.log(`listening on port ${PORT}`)
        })
    } catch (err) {
        console.log(err)
    }

}

 */