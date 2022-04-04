const path = require('path');
const fs = require('fs');

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

const { Car, File, City, Feature, Color, BodyType, FuelType, Brand, CarCountry } = require('./models');

module.exports = function (app) {
    
}
