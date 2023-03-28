const MongoClient = require('mongodb').MongoClient
const express = require('express')
const nunjucks = require('nunjucks')
const bcrypt = require('bcrypt')

const app = express()
const PORT = 5000   
const saltRounds = 10;

//Schema for 

const startServer = async () => {
    //Connect to the database, wait for it
    try {
        const client = await MongoClient.connect('mongodb+srv://gonzalopassa:47095360gG@cluster0.eqtz7we.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology: true})

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
            res.render(templateDir + '/login.html')
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
