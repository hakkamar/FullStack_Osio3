const express = require('express')
const app = express()

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Marko Hakkarainen",
        "number": "040-123456",
        "id": 4
      }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/info', (req, res) => {
    //console.log(' tää on /info')
    //console.log('puhelinluettelossa ', persons.length, ' henkilön tiedot')
    //console.log(Date())

    const montako = 'puhelinluettelossa ' + persons.length + ' henkilön tiedot'
    const nyt = Date()
    const alku = '<p>'
    const loppu = '</p>'
    const tulostettava = alku + montako + loppu + alku + nyt + loppu
    res.send(tulostettava)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
  
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})