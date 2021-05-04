const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth, (request, response) => {
  return response.json([
    {
      name: 'Dummy challange',
      requestedFromUserId: request.userId
    }
  ])
});

module.exports = router;