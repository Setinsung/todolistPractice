const mysql = require('mysql2')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '1q2w3e4r',
    database: 'hotelmanage',
})

module.exports = db.promise()