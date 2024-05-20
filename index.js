const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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
    response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(item => item.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
        //console.log(`404 at ${id}`)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(item => item.id != id)
    //console.log("data:", data)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${data.length} people <br> <br>
    ${(new Date()).toString()}`)
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body
  if (!newPerson.name) {
    return response.status(400).json({"error": "There is no name"})
  }
  if (!newPerson.number) {
    return response.status(400).json({"error": "There is no number"})
  }

  const found = data.find(item => item.name == newPerson.name)
  //console.log("found", found)
  if (found) {
    return response.status(400).json({"error": "This person already exists"})
  }


  // code to run if no exception

  const newID = Math.floor(Math.random() * 10000)
  newPerson.id = newID
  data.push(newPerson)
  //console.log(newPerson)
  response.json(newPerson)
})




const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});