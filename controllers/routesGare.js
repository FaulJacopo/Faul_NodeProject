
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('storia')
})

router.get('/contatti', (req, res) => {
    res.send("Pagina Contatti")
})

module.exports = router