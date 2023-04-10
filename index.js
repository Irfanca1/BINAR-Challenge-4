const express = require('express')
const bodyParser = require('body-parser')
const { Cars } = require('./models')
const multer = require('multer')
const path = require('path')
const accounting = require('accounting')
const swal = require('sweetalert2')
const dayjs = require('dayjs')
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

app.get('/', (req, res) => {
    const data = {
        title: 'Halaman Utama',
        message: 'Ini adalah halaman Utama'
    }
    Cars.findAll()
        .then(cars => {
            res.render('index', { data, cars })
        })
})

app.get('/add', (req, res) => {
    const data = {
        title: 'Add New Car'
    }
    res.render('add', { data })
})

app.post('/car', upload.single('gambar'), (req, res, next) => {
    Cars.create({
        nama_mobil: req.body.nama,
        harga_perhari: req.body.sewa,
        ukuran: req.body.ukuran,
        gambar: req.file.filename
    })
        .then(() => {
            res.redirect('/add?success=true&&message=Data Created')
        })
        .catch(err => {
            res.status(422).json("Can't create car")
        })
})

app.get('/editCar/(:id)/edit', (req, res) => {
    const data = {
        title: 'Edit Car'
    }
    Cars.findOne({
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

    car.nama_mobil = req.body.nama
    car.harga_perhari = req.body.sewa
    car.ukuran = req.body.ukuran
    car.gambar = req.file.filename
    await car.save()

    res.redirect('/?success=true&&message=Data Edit')
})

app.get('/delete/(:id)', (req, res) => {
    Cars.destroy({
        where: { id: req.params.id }
    },)
        .then(() => {
            res.redirect('/')
        })
        .catch(err => {
            res.status(422).json("Can't delete car")
        })
})

app.listen(PORT, () => {
    console.log(`Server sudah berjalan, silakan buka http://localhost:${PORT}`);
})

module.exports = multer({ storage })