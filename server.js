import express from 'express';
import bodyParser from 'body-parser';

require('dotenv').config({silent:"true"});
var knex = require('./config/knex');

const dbUrl = process.env.DATABASE_URL;

const app = express();
app.use(bodyParser.json());

function validate(data){
  let errors = {};
  if(data.title === '') errors.title = "Can't be empty";
  if(data.cover === '') errors.cover = "Can't be empty";
  const isValid = Object.keys(errors).length === 0;
  
  return { errors, isValid };
}

app.get('/api/games', (req, res) => {
  knex('games').then((games) => {
    console.log('GAMES', games);
    res.json({ games })
  });
});

app.post('/api/games', (req, res) => {
  const { errors, isValid } = validate(req.body);
  if(isValid){
    const { title, cover } = req.body;
    
    knex('games')
    .returning('id')
    .insert({ title, cover })
    .then((idx) => {
      knex('games').where({id: parseInt(idx)}).first()
      .then(r => {
        console.log('RETURN', r)
        res.json({ game: r })
      })
    })
    .catch(err => {
      res.status(500).json({ errors: { global: "Something went wrong here: " + err }});
    });
    
  } else {
    res.status(400).json({ errors });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({
    errors: {
      global: "Still working on it - check back later"
    }
  })
});

app.listen(8080, () => console.log('Server is running on localhost:8080'));