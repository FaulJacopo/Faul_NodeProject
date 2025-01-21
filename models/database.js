
const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: "localhost",
    user: "userRiva",
    password: "Admin$00",
    database: "SB_RIVA"
})

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected")
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

exports.news = async function () {
    let sql = "SELECT * FROM news ORDER BY id DESC"
    let news = []

    conn.query(sql, (err, results) => {
        results.forEach(element => {
            news.push(element)    
        });
    })

    return news
}

exports.deleteNews = function(id) {
    let sql = `DELETE FROM news WHERE id = ${id}`

    conn.query(sql, (err, results) => {
        if (err) throw err
    })
}

exports.newsLimited = async function(limit) {
    let sql = `SELECT * FROM news ORDER BY id DESC LIMIT ${limit}`
    let news = []

    conn.query(sql, (err, results) => {
        results.forEach(element => {
            news.push(element)    
        });
    })

    return news
}

exports.connection = conn

exports.login = function(username, password) {
    let sql = `SELECT * FROM users WHERE username LIKE '${username}' AND password LIKE '${password}'`
    
    conn.query(sql, (err, results) => {
        if (results)
            return true;
        return false;
    })
}

exports.newNews = function(image, title, description, author) {
    let data = new Date()
    let formattedData = formatDate(data)
    //let sql = `INSERT INTO news (title, description, image, published_date, author) VALUES ('${title}','${description}','${image}','${formattedData}','${author}')`
    let sql = `INSERT INTO news (title, description, image, published_date, author) VALUES (?, ?, ?, ?, ?)`

    conn.query(sql, [title, description, image, formattedData, author], (err, results) => {
        if (results)
            return true;
        return false;
    })
}