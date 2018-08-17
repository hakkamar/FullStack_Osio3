const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

var kpl = 0
alustaKpl()

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

function alustaKpl () {
    Person
    .find({})
    .then(persons => {
        //console.log('Taulukossa on ', persons.length)
        kpl = persons.length
    })
}

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    alustaKpl()
    const montako = 'puhelinluettelossa ' + kpl + ' henkilön tiedot'
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
        .then(alustaKpl())
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if ( person ) {
                response.json(formatPerson(person))    
            } else {
                response.status(404).end()
            }            
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})
  
app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {            
            response.status(204).end()
        })
        .then(alustaKpl())
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })    
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log('===> nimi', body.name)
    console.log('===> numero', body.number)

    if (body.name === undefined || body.name === '') {
        return response.status(400).json({error: 'Nimi puuttuu'})
    }
    if (body.number === undefined || body.number === '') {
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
        .then(alustaKpl())
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = ({
        name: body.name,
        number: body.number
    })
  
    Person
      .findByIdAndUpdate(request.params.id, person, { new: true } )
      .then(updatedPerson => {
        response.json(formatPerson(updatedPerson))
      })
      .then(alustaKpl())
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
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