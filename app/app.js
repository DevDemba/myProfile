
const express = require('express')
const app = express()
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (err, res)=>(
  
  res.sendFile(__dirname+'/index.html')
))




passport.use(new OAuth2Strategy({
    authorizationURL: '',
    tokenURL: '',
    clientID: '',
    clientSecret: '',
    callbackURL: undefined
  },{ session: false },{passReqToCallback: true},
  function(accessToken, refreshToken, profile, done) {
    if (profile) {
      user = profile;
      return done(null, user);
      }
      else {
      return done(null, false);
      }
  }
));


app.get('/login',
  passport.authenticate('oauth2'));


app.get('/login/oauth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req)
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  

passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));




app.listen(5000, console.log('ok je suis connecté'))
