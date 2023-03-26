const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const express = require('express')
const nunjucks = require('nunjucks')

const app = express()
const PORT = 5000   

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
        app.use(bodyParser.urlencoded({extended: true}))

        //Make server accept JSON data
        app.use(bodyParser.json())

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

        app.post('/register', (req, res)=>{
            
            
            res.render(templateDir + '/register.html')
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