var express = require('express');
var router = express.Router();

require('dotenv').config({silent:"true"});
var knex = require('../config/knex');

const dbUrl = process.env.DATABASE_URL;

// TODO put this in a separate file
function validate(data){
  let errors = {};
  if(data.title === '') errors.title = "Cannot be empty";
  if(data.cover === '') errors.cover = "Cannot be empty";
  const isValid = Object.keys(errors).length === 0;
  
  return { errors, isValid };
}

router.use('*', (req,res,next) => {
  console.log('ROUTER', req.params)
  next();
});

router.get('/', (req, res) => {
  console.log('ROUTE GET /api/games');
  knex('games').orderBy('id', 'asc').then((games) => {
    res.json({ games })
  });
});

router.post('/', (req, res) => {
  console.log('ROUTE POST /api/games');
  
  // ALWAYS VALIDATE DATA ON SERVER - DON"T TRUST CLIENT
  const { errors, isValid } = validate(req.body);
  if(isValid){
    const { title, cover } = req.body;
    
    knex('games')
    .returning('id')
    .insert({ title, cover })
    .then((idx) => {
      knex('games').where({id: parseInt(idx)}).first()
      .then(game => {
        res.json({ game: game });
      })
    })
    .catch(err => {
      res.status(500).json({ errors: { global: "Something went wrong here: " + err }});
    });
    
  } else {
    res.status(400).json({ errors });
  }
});

router.get('/:id', (req, res) => {
  console.log('ROUTE GET by id /api/games/:id', req.params);
  knex('games').where({id: parseInt(req.params.id)}).first().then((game) => {
    res.json({ game });
  });
});

router.put('/:id', (req, res) => {
  console.log('ROUTE PUT /api/games', req.params);
  
  // ALWAYS VALIDATE DATA ON SERVER - DON"T TRUST CLIENT
  const { errors, isValid } = validate(req.body);
  if(isValid){
    // update will deconstruct appropriate params
    // bu t it probably better to just pick off what we need
    // method 1) knex('games').where({id: parseInt(req.params.id)}).update(req.body).returning('id')
    //method 2
    const { title, cover } = req.body;
    knex('games').where({id: parseInt(req.params.id)}).update({title, cover}).returning('id')
    .then((idx) => {
      return knex('games').where({id: parseInt(idx)}).first()
    })
    .then((game) => {
      res.json({ game });
    })
    .catch(err => {
      console.log('ERROR IN PUT', err)
      res.status(500).json({ errors: { global: "Something went wrong here: " + err }});
    });
  } else {
    res.status(400).json({ errors });
  }
});

router.delete('/:id', (req, res) => {
  console.log('ROUTE DELETE by id /api/games/:id', req.params);
  knex('games').where({id: parseInt(req.params.id, 10)}).del().then(() => {
    res.json(req.params.id);
  });
});

module.exports = router;