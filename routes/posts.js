const express = require('express')
const router = express.Router()

const connection = require('../config/database')

router.get('/', function (req, res) {
    connection.query('SELECT * FROM "Cars" ORDER BY id ASC', (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error'
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'List Data Cars',
                data: results.rows
            })
        }
    })
})

router.post('/posts', (req, res) => {
    const { nama_mobil, harga_perhari, ukuran } = req.body;
    const gambar = 'default.jpg'

    const query = `INSERT INTO "Cars" (nama_mobil, harga_perhari, ukuran, gambar)
                 VALUES ($1, $2, $3, $4)`;

    const values = [nama_mobil, harga_perhari, ukuran, gambar];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                status: false,
                message: 'Terjadi kesalahan saat menambahkan data mobil'
            });
        } else {
            // Kirim response berupa data mobil yang berhasil ditambahkan
            res.status(201).json({
                status: 'success',
                message: 'Data mobil berhasil ditambahkan',
                data: result.rows[0]
            });
        }
    });
})

router.post('/update/:id', (req, res) => {
    const { nama_mobil, harga_perhari, ukuran } = req.body;
    let id = req.params.id

    const query = `UPDATE "Cars" SET "nama_mobil"=$1, "harga_perhari"=$2, "ukuran"=$3 WHERE id=${id}`;

    const values = [nama_mobil, harga_perhari, ukuran];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                status: false,
                message: 'Internal Server Error'
            });
        } else {
            // Kirim response berupa data mobil yang berhasil ditambahkan
            res.status(201).json({
                status: 'success',
                message: 'Update Data Successfully',
                data: result.rows[0]
            });
        }
    });
})

router.get('/deleteCar/:id', (req, res) => {
    let id = req.params.id
    connection.query(`DELETE FROM "Cars" WHERE id=${id}`, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error'
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully'
            })
        }
    })
})



module.exports = router