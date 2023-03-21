const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const express = require('express')

const app = express()
const PORT = 5000   

const startServer = async () => {
    //Connect to the database, wait for it
    try {
        const client = await MongoClient.connect('mongodb+srv://gonzalopassa:47095360gG@cluster0.eqtz7we.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology: true})

        //Name database
        const db = client.db('harmonee')
        console.log('Connected')
        //create collection of users
        const usersCollection = db.collection('users')
        
        //use body parser before anything else
        app.use(bodyParser.urlencoded({extended: true}))

        //Make server accept JSON data
        app.use(bodyParser.json())

        //serve static files, literally just use this with the directory NAME NOT PATH and css and js automagically loaded
        app.use(express.static('public'))

        const templateDir = __dirname + '/public/templates'

        app.get('/', (req, res)=> {
            res.sendFile(templateDir + '/index.html')
        })

        //login
        app.get('/login.html', (req, res)=>{
            res.sendFile(templateDir + '/login.html')
        })

        //register
        app.get('/register.html', (req,res) => {
            res.sendFile(templateDir + '/register.html')
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