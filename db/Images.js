const mongoose  = require('mongoose');

const imageSchema = mongoose.Schema({
    image:String
})

module.exports = mongoose.model('images',imageSchema)