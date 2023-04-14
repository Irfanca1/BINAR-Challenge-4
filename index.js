const express = require('express')
const bodyParser = require('body-parser')
const { Cars } = require('./models')
const multer = require('multer')
const path = require('path')
const accounting = require('accounting')
const swal = require('sweetalert2')
const dayjs = require('dayjs')
const fs = require('fs')
const { Op } = require('sequelize');
const app = express()
const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())

app.locals.accounting = accounting;
app.locals.dayjs = dayjs;
app.locals.swal = swal;

const publicDirectory = path.join(__dirname, 'public')
const uploadDirectory = path.join(publicDirectory, 'images')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

const postRouter = require('./routes/posts')
app.use('/api/car', postRouter)

app.get('/', async (req, res) => {
    const data = {
        title: 'Halaman Utama',
        message: 'Ini adalah halaman Utama'
    }
    if (req.query.filter) {
        await Cars.findAll({
            where: {
                ukuran: {
                    [Op.substring]: req.query.filter
                }
            },
            order: [['id', 'ASC']]
        })
            .then(cars => {
                res.render('index', { data, cars })
            })
    } else {
        products = await Cars.findAll({
            order: [['id', 'ASC']]
        })
            .then(cars => {
                res.render('index', { data, cars })
            })
    }


})

app.get('/search/car', async (req, res) => {
    // Cari Mobil 
    const data = {
        title: 'Halaman Utama',
        message: 'Ini adalah halaman Utama'
    }
    if (req.query.search) {
        let searchCar = req.query.search
        await Cars.findAll({
            where: {
                nama_mobil: {
                    [Op.like]: `%${searchCar}%`
                }
            }
        })
            .then(cars => {
                res.render('index', { data, cars, searchCar })
            })
    } else {
        await Cars.findAll({
            order: [['id', 'ASC']]
        })
            .then(cars => {
                res.render('index', { data, cars })
            })
    }
})

app.get('/add', (req, res) => {
    const data = {
        title: 'Add New Car'
    }
    res.render('add', { data })
})

app.post('/car', upload.single('gambar'), async (req, res) => {
    await Cars.create({
        nama_mobil: req.body.nama,
        harga_perhari: req.body.sewa,
        ukuran: req.body.ukuran,
        gambar: req.file ? req.file.filename : 'default.jpg'
    })
        .then(() => {
            res.redirect('/add?success=true&&message=Data Created')
        })
        .catch(err => {
            res.status(422).json("Can't create car")
        })
})

app.get('/editCar/(:id)/edit', async (req, res) => {
    const data = {
        title: 'Edit Car'
    }
    await Cars.findOne({
        where: { id: req.params.id }
    })
        .then(car => {
            res.render('edit', { data, car })
        })
        .catch(err => {
            res.render('error')
        });
})

app.post('/editCar/(:id)', upload.single('gambar'), async (req, res) => {
    const car = await Cars.findOne({
        where: { id: req.params.id }
    })
    if (!car) {
        return res.status(404).send('Car not found')
    }

    const oldGambar = car.gambar

    car.nama_mobil = req.body.nama
    car.harga_perhari = req.body.sewa
    car.ukuran = req.body.ukuran
    car.gambar = req.file ? req.file.filename : 'default.jpg'
    await car.save()

    if (oldGambar !== 'default.jpg' && fs.existsSync(`public/images/${oldGambar}`)) {
        fs.unlinkSync(`public/images/${oldGambar}`)
    }

    res.redirect('/?success=true&&message=Data Edit')
})

app.get('/delete/(:id)', async (req, res) => {
    const car = await Cars.findOne({
        where: { id: req.params.id }
    })
    if (!car) {
        return res.status(404).send('Car not found')
    }

    const gambarDelete = car.gambar

    Cars.destroy({
        where: { id: req.params.id }
    })

    if (gambarDelete !== 'default.jpg' && fs.existsSync(`public/images/${gambarDelete}`)) {
        fs.unlinkSync(`public/images/${gambarDelete}`)
    }

    res.redirect('/')
})

app.listen(PORT, () => {
    console.log(`Server sudah berjalan, silakan buka http://localhost:${PORT}`);
})

module.exports = multer({ storage })