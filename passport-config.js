// sessions serialzeUser or deserialize, what the hell is all this???
//--- Suppose a user gets authenticated ... remember we have to pass the credentials everytime the user send any request that can turn out to be very risky. So in order to avoid passing credentials everytime we pass an unique cookie set in the users browser when first time we authenticated the user.
//  log in --reques url has credentials-- authenticated first time-- session gets established with cookie -- now any request has that cookie 
// done functions call serialize and deseralize bcoz they set up the user session and retrieve tha serial key when the session is over that is when the user closes the tab.
const localStrategy = require('passport-local').Strategy // starategies are basically authentication mechanism. like how u wanna login??? by fb insta or whatever and to work on the mechanism there are seperate modules which u can require.
const bcrypt = require('bcryptjs')


 function initialize(passport, getUserByEmail, getUserbyId){
  
    const authenticateUser = async (email, password, done)=>{
    const user = getUserByEmail(email) // what the hell is this?
    if(user==null){
        return done(null, false, {message: 'no user with that email'})
    }
    try{
        if ( await bcrypt.compare(password,user.password)){
            return done(null, user)//everytime it passes the info to serializeUser
        }else{
            return done(null, false, { message : 'Password incorrect'})
        }
    }catch(e){
        return done(e)
    }
}
    passport.use (new localStrategy({usernameField: 'email'}, authenticateUser))//it is the strategy config which will call the function
    passport.serializeUser((user,done)=> done(null,user.id))
    passport.deserializeUser((id,done)=>{
      return  done(null,getUserbyId(id))
    })
}

module.exports= initialize
