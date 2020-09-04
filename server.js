require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const MOVIE = require('./movies.json')
app.use(morgan('dev'))
app.use(helmet());
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
       console.log('validate bearer token middleware')
       const lock = process.env.API_TOKEN;
       const key = req.get('Authorization').split(' ')[1];
       if(!key ||lock !== key){
           res.status(401).json({error: 'Invalid token'})
       }
       // move to the next middleware
       next()
     });

function handleGetMovie(req, res) {
    let result = MOVIE;
    if(req.query.genre){
        result = result.filter(movie=>movie.genre.toLowerCase()
        .includes(req.query.genre.toLowerCase()))
    }
    if(req.query.country){
        result = result.filter(movie=>movie.country.toLowerCase()
        .includes(req.query.country.toLowerCase()))
    }
    if(req.query.avg_vote){
        result= result.filter(movie=>movie.avg_vote > req.query.avg_vote)
    }
       res.json(result)
     }
 app.get('/movies', handleGetMovie);
const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
