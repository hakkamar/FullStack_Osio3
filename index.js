const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
//app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) {
    return [      
      tokens.method(req, res),
      tokens.url(req, res),
      JSON.stringify(req.body, null),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }))
app.use(express.static('build'))

const formatPerson = (person) => {
    return {
      name: person.name,
      number: person.number,
      id: person._id
    }
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/info', (request, response) => {
    console.log(' tää on /info')
    console.log('puhelinluettelossa ', persons.length, ' henkilön tiedot')
    console.log(Date())

    const montako = 'puhelinluettelossa ' + persons.length + ' henkilön tiedot'
    const nyt = Date()
    const alku = '<p>'
    const loppu = '</p>'
    const tulostettava = alku + montako + loppu + alku + nyt + loppu
    response.send(tulostettava)
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(formatPerson))
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(formatPerson(person))
        }) 
})
  
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({error: 'Nimi puuttuu'})
    }
    if (body.number === undefined) {
        return response.status(400).json({error: 'Numero puuttuu'})
    }

    //
    // tää kans kuntoon....
    //
    //const existingPerson = persons.find(person => person.name === body.name)    
    //if ( existingPerson ) {
    //    return response.status(400).json({error: 'Nimi on jo luettelossa'})
    //}

    const person = new Person ({
      name: body.name,
      number: body.number
    })
  
    person
        .save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
})

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})