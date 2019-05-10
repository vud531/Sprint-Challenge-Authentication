const axios = require('axios');
const bcrypt = require('bcryptjs');

const { authenticate } = require('../auth/authenticate');
const db = require('../database/dbConfig')
const Users = db('users')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

const register= async(req, res, next) => {
  // console.log(req.body)
  try {
    const { username, password } = req.body
    if (username && password) {
      const hash = bcrypt.hashSync(password, 5)
      const [id] = await db('users').insert({username, password: hash})
      console.log(id)
      const newUser = await db('users').where('id',id).first()
      res.status(200).json({
        message: 'Welcome ' + newUser.username
      })
      return;
    } else {
      res.status(400).json({
        error: 'Missing Info. Try Again'
      })
    }
  }
  catch(err) {
    next(err)
  }

  // implement user registration
  // db('users').insert()
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
