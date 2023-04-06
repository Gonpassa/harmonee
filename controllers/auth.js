const User = require('../models/User')
const bcrypt = require('bcrypt')

const saltRounds = 10

exports.getLogin = (req, res) => {
    if (req.user){
        return res.redirect('/journal')
    }
    res.render('login', {
        title: 'Login'  
    })
}

exports.postLogin = async (req, res, next) => {
    //See if username in DB
    const user = await User.findOne({username: req.body.username.toLowerCase()})
    if(!user){
        const errorMessage = 'Username not registered'
        return res.render('login', {errorMessage: errorMessage})
    }
    const match = await bcrypt.compare(req.body.password, user.password)

    if(!match){
        const errorMessage = 'Username exists but does not match password'
        return res.render('login', {errorMessage: errorMessage})
    }
    //start session
    req.session.username = user.username
    res.redirect('/profile')
}

exports.getRegister = (req, res, next) => {
    if(req.user){
        return res.redirect('/journal')
    }
    res.render('register', {
        title: 'Register'
    })
}

exports.postRegister = async (req, res, next) => {
    if(req.body.email === ''){
        delete req.body.email
    }
    const user  = new User({
        username: req.body.username.toLowerCase(),
        email: req.body.email ? req.body.email.toLowerCase() : undefined,
        password: req.body.password
    })


    //Check if a username or email already exist in the database

    const existingUser = await User.findOne({$or: [
        {username: req.body.username},
        {email: req.body.email},
        ]})
    if(existingUser){
        let  errorMessage;
        if(existingUser.username === req.body.username.toLowerCase()){
            errorMessage = 'Username already taken'
            console.log(errorMessage);
            return res.render('register', {errorMessage: errorMessage})
        }else if(existingUser.email){
            errorMessage = 'Email already taken'
            return res.render('register', {errorMessage: errorMessage})
        }
    }
    //If username and email unique hash password and create new user in db
    const salt =  bcrypt.genSaltSync(saltRounds)
    user.password =  bcrypt.hashSync(req.body.password, salt)

    await user.save()
    res.redirect('/')
}