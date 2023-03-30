const MongoClient = require('mongodb').MongoClient
const express = require('express')
const nunjucks = require('nunjucks')
const bcrypt = require('bcrypt')
require('dotenv').config()

const app = express()
const PORT = 5000   
const saltRounds = 10;

let dbConnectionStr = process.env.DB_STRING
//Schema for 

const startServer = async () => {
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

        //serve static files, literally just use this with the directory NAME NOT PATH and css and js automagically loaded
        app.use(express.static('public'))

        const templateDir = __dirname + '/public/templates'

        //Configure nunjucks
        nunjucks.configure(templateDir, {
            autoescape: true,
            express: app
        })

        app.get('/', (req, res)=> {
            res.render(templateDir + '/index.html')
        })

        //login
        app.get('/login.html', (req, res)=>{
            res.render(templateDir + '/login.html')
        })

        //Login user
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
            res.render(templateDir + '/index.html')
        })

        //register
        app.get('/register.html', (req,res) => {
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
            res.redirect('/login.html')
        })




        //Start server here
        app.listen(PORT, function(){
            console.log(`listening on port ${PORT}`)
        })
    } catch (err) {
        console.log(err)
    }

}

startServer()
