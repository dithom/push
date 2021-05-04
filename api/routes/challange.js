import express from 'express';

// Import middlewares
import auth from '../middlewares/auth';

// Define globals
const router = express.Router();

router.get('/', auth, (request, response) => {
  return response.json([
    {
      name: 'Dummy challange',
      requestedFromUserId: request.userId,
    },
  ]);
});

module.exports = router;
