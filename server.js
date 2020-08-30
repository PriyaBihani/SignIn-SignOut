if (process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)

)

const users=[]

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended : false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(methodOverride('_method'))
app.use(passport.initialize())//this middleware is required to use passport in express
app.use(passport.session())// this is required to use persistant log in session

app.get('/',checkAuthenticated, (req,res)=>{
    res.render('index.ejs',{name : req.user.name})
})
app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs')
})
app.post('/login',checkNotAuthenticated,passport.authenticate('local',{ // .authenticate is an inbuilt function in the passport module. When user send us the request to log in, it carries some data(credentials) which are being parsed by the authenticate function and then invokes a "verify callback" function, which in this case is initializePassport in this file or initialize in passport-config file, with credentials as its parameter. 
    successRedirect:"/",
    failureRedirect:"login",
    failureFlash: true
}))
app.get('/register', checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs')
})
app.post('/register',checkNotAuthenticated, async (req,res)=>{
    try{
        const hashedPassword = await  bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

app.delete('/logout',(req,res)=>{
    req.logOut()//passport set this up and clear our session
    res.redirect('/login')
})

function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/login')
    }
}
function checkNotAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return res.redirect('/')
    }else{
        next()
    }
}
app.listen(3000)