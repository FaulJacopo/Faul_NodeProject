
const express = require('express')
const fileUpload = require('express-fileupload')
const database = require('../models/database')
const session = require('express-session')
const router = express.Router()

router.use(
    session({
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false,
    })
)

router.use(fileUpload())
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

function convalidaLogin(req, res, next) {
    const {username, password} = req.body
    
    if (!username || !password)
        return res.send("Inserire tutti i campi!")
    next()
}

function convalidaNews(req, res, next) {
    const {newsTitle, newsDescription, newsAuthor} = req.body
    const {newsImage} = req.files

    if (!newsImage || !newsTitle || !newsDescription || !newsAuthor)
        return res.send("Inserire tutti i campi")
    next()
}

router.get('/', (req, res) => {
    if (req.session.username && req.session.remember) {
        res.redirect('/admin/dashboard')
    }

    res.render('login')
})

router.post('/news/:id', (req, res) => {
    database.deleteNews(req.params.id)
    res.redirect('/admin/dashboard')
})

router.get('/dashboard', (req, res) => {
    if (typeof req.session.username !== 'undefined') {
        let sql = "SELECT * FROM news ORDER BY id DESC"
        let news = []

        database.connection.query(sql, (err, results) => {
            results.forEach(element => {
                news.push(element)    
            })
            res.render('dashboard', {
                news: news
            })
        })
    } else {
        res.redirect('/')
    }
})


router.get('/news', (req, res) => {
    res.render('createNews')
})

router.post('/news', convalidaNews, (req, res) => {
    const {newsTitle, newsDescription, newsAuthor} = req.body
    const {newsImage} = req.files

    newsImage.mv(__dirname + '/../public/img/' + newsImage.name);

    let newsImageURL = `img/${newsImage.name}`

    database.newNews(newsImageURL, newsTitle, newsDescription, newsAuthor)
    res.redirect('/news')
})

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session!")
        } else {
            console.log("Session destroyed")
        }
    })

})

router.post('/login', convalidaLogin, (req, res) => {
    if (req.session.username && req.session.remember) {
        res.redirect('/dashboard')
    }

    const {username, password, remember} = req.body

    let sql = `SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`
    
    database.connection.query(sql, (err, results) => {
        if (results.length != 0) {
            if (remember) {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30
                req.session.remember = true
            }
            req.session.username = username
            res.redirect('/admin/dashboard')
        } else {
            res.redirect('/admin')
        }
    })
})


module.exports = router