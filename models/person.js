const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI
//const url = 'mongodb://fullstack:salasana@ds121182.mlab.com:21182/osa3'

//
//  Tuli ilmoitus käynnistettäessä:
//
// (node:16604) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. 
// To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
//
//  Korjattiin noin.... 
mongoose.connect(url, { useNewUrlParser: true })
//mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person