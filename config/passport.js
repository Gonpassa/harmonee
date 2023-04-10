const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
    try{
    const user = await User.findOne({ username: username.toLowerCase() });

    if(!user){
      return done(null, false, {msg: `Username ${username} not found.`})
    }
    if(!user.password){
      return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' })
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {return done(err)}
      if(isMatch){
        return done(null, user)
      }
      return done(null, false, {msg: 'Invalid username or password'})
    })
  }catch(err){
    done(err)
  }
}))
  

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}
