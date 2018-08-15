const mongoose = require('mongoose')
const url = 'mongodb://fullstack:salasana@ds121182.mlab.com:21182/osa3'

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person