const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')

const app = express()

morgan.token('body', (req, res) => {
  if (Object.keys(req.body).length !== 0) {
    toReturn = {...req.body}
    delete toReturn.id
    return(JSON.stringify(toReturn))
  } else {
    return ''
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } 
  next(error)
}

app.use(express.json())
app.use( morgan(':method :url :status :res[content-length] - :response-time ms :body') )
app.use(cors())
app.use(express.static('dist'))



var data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Note.find({}).then(items => {
      response.json(items)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Note.findById(request.params.id)
      .then(note => {
        if (note) {
          response.json(note)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(e => {
        console.log(e)
        response.status(500).end()
      })
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${data.length} people <br> <br>
    ${(new Date()).toString()}`)
})


app.post('/api/persons', (request, response) => {
  const newPerson = new Note({
    name: request.body.name,
    number: request.body.number,
  })
  console.log(newPerson)

  newPerson.save().then(result => {
    console.log(`${request.body.name} added with # ${request.body.number}`)
  })
})

app.put('/api/persons/:id', (request, response) => {

  const note = {
    name: request.body.name,
    number: request.body.number
  }

  Note.findByIdAndUpdate(request.params.id, )
  console.log("put request")
})

app.use(errorHandler)

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});