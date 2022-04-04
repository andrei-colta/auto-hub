const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/auto-hub'

mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection;

db.once('open', _ => {
    console.log('db connected')
});

var userSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    picture: String,
    city: String,
    birthday: Date,
    phone: String
});

var carSchema = new mongoose.Schema({
    user_id: String,
    maker: String,
    model: String,
    year: {
        value: Number,
        label: String
    },
    fuelType: String,
    bodyType: String,
    price: Number,
    color: String,
    features: [String],
    mileage: Number,
    description: String,
    color: String,
    engineSize: Number,
    power: Number
});

var fileSchema = new mongoose.Schema({
    listingId: String,
    name: String
});

var citySchema = new mongoose.Schema({
    name: String
});

var featureSchema = new mongoose.Schema({
    name: String
});

var colorSchema = new mongoose.Schema({
    name: String
});

var bodyTypeSchema = new mongoose.Schema({
    name: String
});

var fuelTypeSchema = new mongoose.Schema({
    name: String
});

var brandSchema = new mongoose.Schema({
    name: String,
    country: String,
    logo: String
});

var carCountrySchema = new mongoose.Schema({
    name: String,
    flag: String
});

User = mongoose.model('users', userSchema);
Car = mongoose.model('cars', carSchema);
File = mongoose.model('files', fileSchema);
City = mongoose.model('cities', citySchema);
Feature = mongoose.model('features', featureSchema);
Color = mongoose.model('colors', colorSchema);
BodyType = mongoose.model('bodyType', bodyTypeSchema, 'bodyType');
FuelType = mongoose.model('fuelType', fuelTypeSchema, 'fuelType');
Brand = mongoose.model('brands', brandSchema);
CarCountry = mongoose.model('carCountries', carCountrySchema, 'carCountries');

const app = express();
const PORT = 1234;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.listen(PORT, () => {
    console.log('Server is listening on port: ' + PORT);
});

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './pictures')
    },
    filename: function (req, file, cb) {
        const oldName = file.originalname;
        const extensionParse = oldName.split('.');
        const extension = extensionParse[extensionParse.length - 1];
        const oldNameNoExt = oldName.substring(0, oldName.length - extension.length - 1);
        const timeStamp = (new Date()).getTime();
        cb(null, oldNameNoExt + timeStamp + '.' + extension);
    }
});
var upload = multer({ storage: storage });

app.post('/access/login', function (req, res) {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    User.findOne({ email: email, password: password }, (err, user) => {
        if (user) {
            return res.send({ status: 'LoginSuccessful', data: user });
        }
        res.send({ status: 'LoginFailed' });
    });
});

app.post('/access/signup', function (req, res) {
    const body = req.body;
    const email = body.email;

    User.findOne({ email: email }, (err, user) => {
        if (user) {
            return res.send({ status: 'AccountAlreadyExists' });
        }

        body.picture = 'https://i.stack.imgur.com/34AD2.jpg';
        body.birthday = new Date();

        var user = new User(body);

        user.save((err, user) => {
            console.log('SIGNUP RESPONSE', user)
            if (!err) {
                res.send({ status: 'DataInserted', id: user._id });
            } else {
                res.send({ status: 'SignupFailed' });
            }
        });
    });
});

app.get('/profile/getProfile', function (req, res) {
    const query = req.query;
    const user_id = query.user_id;

    User.findOne({ _id: user_id }, (err, user) => {
        if (user) {
            return res.send({ status: 'DataRetrieved', data: user });
        }

        res.send({ status: 'NotFound' });
    });
});

app.post('/profile/updateProfileData', function (req, res) {
    const user_id = req.body._id;

    User.replaceOne({ _id: user_id }, req.body, (err, response) => {
        if (!err) {
            return res.send({ status: 'DataUpdated' });
        }

        res.send({ status: 'NotFound' });
    });
});

app.post('/profile/uploadPicture', upload.single('picture'), (req, res) => {
    const user_id = req.query.user_id;

    User.update({ _id: user_id }, { picture: req.file.filename }, (err, response) => {
        if (!err) {
            res.send({
                message: 'PictureUploaded',
                name: req.file.filename
            });
        } else {
            res.send({ message: 'Could not upload file' });
        }
    });
});

app.get('/profile/getCities', function (req, res) {
    City.find((err, cities) => {
        if (!err) {
            res.send({ status: 'DataRetrieved', data: cities });
        } else {
            res.send({ status: 'NotFound' });
        }
    });
});

var deletePictures = function (pics) {
    for (let fileName of pics) {
        File.findOne({ name : fileName }, (err, selectedFile) => {
            if (selectedFile) {
                fs.unlink('./pictures/' + fileName);
            }
        });
    }
}

app.post('/cars/add', function (req, res) {
    const body = req.body;
    const picsToDelete = body.picsToDelete;
    const user_id = req.query.user_id;
    body.user_id = user_id;
    const alreadyExists = (body._id ? true : false);

    var car = new Car(body);

    if (alreadyExists) {
        Car.replaceOne({ _id: body._id }, car, (err, response) => {
            if (!err) {
                if (picsToDelete) {
                    deletePictures(picsToDelete);
                    File.deleteMany({ name: { '$in': picsToDelete } }, (err) => {
                        if (!err) {
                            res.send({ status: 'DataInserted', id: car._id });
                        } else {
                            res.send({ status: 'ErrorDeletingFiles' });
                        }
                    });
                } else {
                    res.send({ status: 'DataUpdated' });
                }
            } else {
                res.send({ status: 'UpdateFailed' });
            }
        });
    } else {
        car.save((err, newCar) => {
            if (!err) {
                res.send({ status: 'DataInserted', id: newCar._id });
            } else {
                res.send({ status: 'InsertFailed' });
            }
        });
    }
});

app.post('/cars/uploadPictures', upload.single('picture'), (req, res) => {
    var file = new File({ listingId: req.query.listingId, name: req.file.filename });
    file.save((err, file) => {
        if (!err) {
            res.send({
                message: 'File uploaded successfully',
                name: req.file.filename
            });
        } else {
            res.send({ message: 'Could not upload file' });
        }
    });
});

app.get('/cars/getPicture', function (req, res) {
    const fileName = req.query.fileName;

    res.sendFile(path.join(__dirname, './pictures', fileName));
});

app.get('/cars/getPictures', function (req, res) {
    const listingId = req.query.listingId;

    File.find({ listingId: listingId }, (err, files) => {
        res.send({ status: 'DataRetrieved', data: files });
    });
});

app.delete('/cars/deletePicture', function (req, res) {
    const fileName = req.query.fileName;

    File.deleteOne({ name: fileName }, (err) => {
        if (!err) {
            fs.unlink('./pictures/' + fileName);
            res.send({ status: 'FileDeleted' });
        } else {
            res.send({ status: 'FileNotFound' });
        }
    });
});

app.delete('/cars/delete', function (req, res) {
    const id = req.query.id;

    Car.deleteOne({ _id: id }, (err) => {
        if (!err) {
            res.send({ status: 'DataDeleted' });
        } else {
            res.send({ status: 'NotFound' });
        }
    });
});

app.get('/cars/getCarById', function (req, res) {
    const id = req.query.id;

    Car.findOne({ _id: id }, (err, car) => {
        if (!err) {
            res.send({ status: 'DataRetrieved', data: car });
        } else {
            res.send({ status: 'NotFound' });
        }
    });
});

app.get('/cars/getCarsByUserId', function (req, res) {
    const user_id = req.query.user_id;

    Car.find({ user_id: user_id }, (err, cars) => {
        if (!err) {
            res.send({ status: 'DataRetrieved', data: cars });
        } else {
            res.send({ status: 'CouldNotFind' });
        }
    });
});

app.get('/cars/getAll', function (req, res) {
    Car.find((err, cars) => {
        res.send({ status: 'DataRetrieved', data: cars });
    });
});

app.get('/cars/getFiltered', function (req, res) {
    const query = req.query;

    const maker = query.maker;
    const minYear = +query.minYear;
    const maxYear = +query.maxYear;
    const fuelType = query.fuelType;
    const bodyType = query.bodyType;
    const minPrice = +query.minPrice;
    const maxPrice = +query.maxPrice;
    const color = query.color;

    var filters = {};

    if (maker) {
        filters.maker = maker;
    }

    if (minYear || maxYear) {
        filters.year = {};
    }

    if (minYear) {
        filters.year['$gt'] = minYear;
    }

    if (maxYear) {
        filters.year['$lt'] = maxYear;
    }

    if (fuelType) {
        filters.fuelType = fuelType;
    }

    if (bodyType) {
        filters.bodyType = bodyType;
    }

    if (minPrice || maxPrice) {
        filters.price = {};
    }

    if (minPrice) {
        filters.price['$gt'] = minPrice;
    }

    if (maxPrice) {
        filters.price['$lt'] = maxPrice;
    }

    if (color) {
        filters.color = color;
    }

    Car.find(filters, (err, cars) => {
        if (!err) {
            res.send({ status: 'DataRetrieved', data: cars });
        } else {
            res.send({ status: 'NotFound' });
        }
    });
});

app.get('/cars/getAllColors', function (req, res) {
    Color.find((err, colors) => {
        res.send({ status: 'DataRetrieved', data: colors });
    });
});

app.get('/cars/getAllFeatures', function (req, res) {
    Feature.find((err, features) => {
        res.send({ status: 'DataRetrieved', data: features });
    });
});

app.get('/cars/getAllBodyTypes', function (req, res) {
    BodyType.find((err, bodyTypes) => {
        res.send({ status: 'DataRetrieved', data: bodyTypes });
    });
});

app.get('/cars/getAllFuelTypes', function (req, res) {
    FuelType.find((err, fuelTypes) => {
        res.send({ status: 'DataRetrieved', data: fuelTypes });
    });
});

app.get('/cars/getAllBrands', function (req, res) {
    Brand.find((err, brands) => {
        res.send({ status: 'DataRetrieved', data: brands });
    });
});

app.get('/cars/getAllCarCountries', function (req, res) {
    CarCountry.find((err, carCountries) => {
        res.send({ status: 'DataRetrieved', data: carCountries });
    });
});
