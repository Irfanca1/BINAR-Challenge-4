const express = require('express')
const router = express.Router()

const connection = require('../config/database')

const { body, validationResult } = require('express-validator')
const { now } = require('mongoose')

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
                message: 'List Data Posts',
                data: results.rows
            })
        }
    })
})

router.post('/addCar', [
    // VALIDATION
    body('nama_mobil').notEmpty(),
    body('harga_perhari').notEmpty(),
    body('ukuran').notEmpty(),
    // body('createdAt'),
    // body('updatedAt'),
    // body('gambar'),
], (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }

    // DEFINE FORM DATA
    let formData = {
        nama_mobil: req.body.nama,
        harga_perhari: req.body.sewa,
        ukuran: req.body.ukuran
        // createddAt: now(),
        // updatedAt: now()
    }

    // INSERT QUERY
    connection.query('INSERT INTO "Cars" (nama_mobil, harga_perhari, ukuran)', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status: true,
                message: 'Insert Data Successfully',
                data: rows[0]
            })
        }
    })
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