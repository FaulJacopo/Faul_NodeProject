
const express = require('express')
const database = require('../models/database')
const session = require('express-session')
const router = express.Router()

router.use('/img', express.static('public/img'))

router.get('/', (req, res) => {
    let sql = "SELECT * FROM news ORDER BY id DESC"
    let news = []

    database.connection.query(sql, (err, results) => {
        results.forEach(element => {
            element.description = element.description.substring(0, 50) + '...'
            news.push(element)    
        })
        res.render('news', {
            news: news
        })
    })
})

router.get('/:id', (req, res) => {
    let sql = "SELECT * FROM news WHERE id = ?"
    let news = []

    database.connection.query(sql, [req.params.id], (err, results) => {
        res.render('view-news', {
            article: results[0]
        })
    })
})

router.get('/contatti', (req, res) => {
    res.send("Pagina Contatti")
})

module.exports = router