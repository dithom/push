import express from 'express';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';
// Import models
import Challange from '../model/Challange';

// Import Db Functions
import challangedb from '../database/challangedb';
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';

// Import Service Functions
import formatDateService from '../services/formatDateService';
import userService from '../services/userService';
// Define globals
const router = express.Router();

// TODO Find solution for challange feeds. Separate collection or put it into challange?
// TODO GET Endpoint for getting a specific challange at /:id including optional ?feed parameter to populate feed (if this will be done as referance)
// TODO PATCH Endpoint for updating properties of a specific challange at /:id
// TODO PUT Endpoint for overriding a specific challange at /:id (maybe for v2)
// TODO Find solution for DELETE Endpoint, as we can not simply delete a challange for all competitors
// TODO After Challange creation, each competitor has to accept the challange -> how is this messaged sent?

/**
 * Finds active challanges associated to signed in user (creator or competitor)
 * Method: GET
 * @returns {Array<Object>} List of challanges
 */
router.get('/active', auth, async (request, response) => {
  const challanges = await challangedb.getActiveChallangesOfUser(
    request.userId
  );
  if (challanges !== null) {
    return response.json(challanges);
  }
  return response.status(400).json(challanges);
});

/**
 * Finds archived challanges associated to signed in user (creator or competitor)
 * Method: GET
 * @returns {Array<Object>} List of challanges
 */
router.get('/archived', auth, async (request, response) => {
  const challanges = await challangedb.getArchivedChallangesOfUser(
    request.userId
  );
  if (challanges !== null) {
    return response.json(challanges);
  }
  return response.status(400).json(challanges);
});

/**
 * Creates a new challange as signed in user
 * Method: POST
 * @param  {string} name
 * @param  {string} description
 * @param  {string} category
 * @param  {Date} startDate
 * @param  {Date} endDate
 * @param  {number} repetitions
 * @param  {string} timespan
 * @param  {string} visibility
 * @param {Array<string>} [competitors]
 * @returns {Object} Created challange
 */
router.post(
  '/create',
  auth,
  body('name').isString().isLength({ min: 6, max: 255 }),
  body('description').isString().isLength({ min: 6, max: 1023 }),
  body('category').isString(),
  body('startDate').isDate(), // yyyy-mm-dd
  body('endDate').isDate(),
  body('repetitions').isInt(),
  body('timespan').isString(),
  body('visibility').isString(),
  body('competitors').isArray(),
  async (request, response) => {
    // Find validation errors and wrap them in an object
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array(),
      });
    }
    // Check dates
    const dateArray = formatDateService.formatDate(
      request.body.startDate,
      request.body.endDate
    );
    const startDate = dateArray[0];
    const endDate = dateArray[1];
    const today = dateArray[2];

    if (startDate < today) {
      return response.status(400).json({
        error: 'The start date can not be set to earlier than today.',
      });
    }

    if (endDate <= startDate) {
      return response.status(400).json({
        error:
          'The end date can not be set to equal or earlier than the start date.',
      });
    }

    // Check if user is also in competitors
    if (request.body.competitors.includes(request.userId)) {
      return response.status(400).json({
        error:
          'The creator of this challange can not be added as a competitor.',
      });
    }

    // Create new challange
    const savedChallange = await challangedb.createNewChallange(request);
    if (savedChallange !== null) {
      return response.json(savedChallange);
    }
    return response.status(400).json(savedChallange);
  }
);

/**
 * Update Challange with attendees
 * Method: PATCH
 * @returns {Object} Created challange
 */
router.patch('/addattendees', auth, async (request, response) => {
  const competitorIds = userService.mapUsernamesToIds(request.body.competitors);
  // find and update challange by name
  const filter = { name: request.body.name };
  const update = { competitors: competitorIds };
  try {
    // update attendee array in collection
    const challanges = await Challange.findOneAndUpdate(filter, update);

    // add attendees to leaderboard list
    for (let i = 0; i < competitorIds.length; i++) {
      challangeLeaderboarddb.saveAttendeetoLeaderboard(
        competitorIds[i],
        challanges._id
      );
    }
    // add creator to leaderboard list
    challangeLeaderboarddb.saveAttendeetoLeaderboard(
      challanges.creator,
      challanges._id
    );

    return response.json(challanges);
  } catch (error) {
    return response.status(400).json(error);
  }
});

/**
 * Get Information of specific Challange (id)
 * Method: GET
 * @returns {Object} Challange
 */
router.get('/:id', auth, async (request, response) => {
  // Check if ID matches one in the users table and change archived to true
  const challange = await challangedb.getChallangeById(request.params.id);
  if (challange !== null) {
    return response.json(challange);
  }
  return response.status(400).json(challange);
});

module.exports = router;
