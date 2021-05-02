const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth, (request, response) => {
  return response.json([
    {
      name: 'Dummy challange',
      requestedFromUser: request.user
    }
  ])
});

module.exports = router;