import express from 'express';
import bodyParser from 'body-parser';

require('dotenv').config({silent:"true"});
var knex = require('./config/knex');

const dbUrl = process.env.DATABASE_URL;

const app = express();
app.use(bodyParser.json());

// handle api requests for games
const games = require('./routes/games');
app.use('/api/games', games);


// 404
app.use((req, res) => {
  res.status(404).json({
    errors: {
      global: "Still working on it - check back later"
    }
  })
});

app.listen(8080, () => console.log('Server is running on localhost:8080'));