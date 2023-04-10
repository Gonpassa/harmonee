const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

 exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/')
    }
    res.render('login', {
      title: 'Login'
    })
  }
  
  exports.postLogin = (req, res, next) => {
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        req.flash('errors', info)
        return res.redirect('/login', {errorMessage: info})
      }
      req.logIn(user, (err) => {
        if (err) { return next(err) }
        req.flash('success', { msg: 'Success! You are logged in.' })
        res.redirect('/', {username: req.user})
      })
    })(req, res, next)
  }
  
  exports.logout = (req, res) => {
    req.logout(() => {
      console.log('User has logged out.')
    })
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
  }
  
  exports.getRegister = (req, res) => {
    if (req.user) {
      return res.redirect('/')
    }
    res.render('register', {
      title: 'Register'
    })
  }
  
  exports.postRegister = async (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (!validator.isLength(req.body.password, { min: 4 })) validationErrors.push({ msg: 'Password must be at least 4 characters long' })
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
    if (validationErrors.length) {
      return res.render('register', {errorMessage: validationErrors[0].msg})
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    const user = new User({
      username: req.body.username.toLowerCase().trim(),
      email: req.body.email,
      password: req.body.password
    })

    try {
      const existingUser = await User.findOne({$or: [{email: req.body.email}, {username: user.username}]})     
      if(existingUser){
        if(existingUser.username == user.username){
        validationErrors.push({msg: 'Username already exists'})
        return res.render('register', {errorMessage: validationErrors[0].msg})
        }else{
          validationErrors.push({msg: 'Email already in use'})
          return res.render('register', {errorMessage: validationErrors[0].msg})
        }
      }

      await user.save();
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      })
    } catch (err) {
      console.log(err)
      return next(err)
    }
  }