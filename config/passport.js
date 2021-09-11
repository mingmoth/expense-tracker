const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({email})
      .then(user => {
      if (!user) {
        console.log('That email is not registered')
        return done(null, false, {message: 'That email is not registered'})
      }
      if (user.password !== password) {
        console.log('Email or Password incorrect')
        return done(null, false, {message: 'Email or Password incorrect'})
      }
      return done(null, user)
      })
      .catch(err => console.log(err))
  }))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}