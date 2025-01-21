const express = require('express')
const router = express.Router()

router.use('/img', express.static('public/img'))

router.get('/', (req, res) => {
    res.render('contact')
})

router.post('/send', (req, res) => {
    const { name, email, message } = req.body
    res.redirect('/contact')
})

module.exports = router 