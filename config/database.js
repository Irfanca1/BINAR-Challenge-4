const { Pool } = require('pg');

const pool = new Pool({
    user: 'irfanchoiruddin',
    host: 'localhost',
    database: 'car_development',
    password: 'irfanchoiruddin123',
    port: 5432,
});

pool.connect(function (err) {
    if (!!err) {
        console.log(err)
    } else {
        console.log('Connection Successfully');
    }
})

module.exports = pool