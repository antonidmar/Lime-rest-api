const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
var cors = require('cors');
const axios = require('axios');

const fetch = axios.create({
    baseURL: 'https://api-test.lime-crm.com/api-test/api/v1/',
    headers: {
        common: {
            'x-api-key': '860393E332148661C34F8579297ACB000E15F770AC4BD945D5FD745867F590061CAE9599A99075210572',
  //          'Content-Type': 'application/hal+json'
        }
    }
})
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/hal+json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/api/lime/:query(*)?', async (req, res) => {
    let query = req.params.query;
    console.log(query);
    if (query){
        if(!query.endsWith('/')){
            query = query + '/';
        }
    } else {
        query = ''
    }

    try {
        const response = await fetch.get(query);
        res.send(response.data);
    } catch (e) {
        console.log(e);
    }

    
})

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
