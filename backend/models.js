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

module.exports = {
    User = mongoose.model('users', userSchema),
    Car = mongoose.model('cars', carSchema),
    File = mongoose.model('files', fileSchema),
    City = mongoose.model('cities', citySchema),
    Feature = mongoose.model('features', featureSchema),
    Color = mongoose.model('colors', colorSchema),
    BodyType = mongoose.model('bodyType', bodyTypeSchema, 'bodyType'),
    FuelType = mongoose.model('fuelType', fuelTypeSchema, 'fuelType'),
    Brand = mongoose.model('brands', brandSchema),
    CarCountry = mongoose.model('carCountries', carCountrySchema, 'carCountries')
};
