const express = require('express')
const hbs = require('hbs')
const routerNews = require('./controllers/routesNews')
const routerGare = require('./controllers/routesGare')
const routerAdmin = require('./controllers/routesAdmin')
const routerContattaci = require('./controllers/routesContattaci')
const database = require('./models/database')

const app = express()

app.use('/css', express.static('public/css'))
app.use('/img', express.static('public/img'))
app.use(express.static('public'))
app.use('/news', routerNews)
app.use('/gare', routerGare)
app.use('/admin', routerAdmin)
app.use('/contattaci', routerContattaci)

app.set('view engine', 'hbs')
app.use(express.json())
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.urlencoded({ extended: true }))

let news = []

app.get('/', (req, res) => {
    let limit = 3
    let sql = `SELECT * FROM news ORDER BY id DESC LIMIT ${limit}`
    let news = []

    database.connection.query(sql, (err, results) => {
        results.forEach(element => {
            element.description = element.description.substring(0, 50) + '...'
            news.push(element)    
        });

        res.render('index', {
            news: news
        })
    })
})

app.get('/storia', (req, res) => {
    res.render('storia')
})

app.get('/scuola-bocce', (req, res) => {
    res.render('scuola')
})

app.listen(8000, () => {
    console.log("#### SERVER ATTIVO SULLA PORTA 8000 ####")
})
