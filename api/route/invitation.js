import express from 'express';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';

// Import Db Functions
import invitationdb from '../database/invitationdb';
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';

// Import Services
import invitationService from '../services/invitationService';
import leaderboardService from '../services/leaderboardService';

// Define globals
const router = express.Router();

/**
 * Finds all pending invitations of user
 * Method: GET
 * @returns {Array<Object>} invitationList
 */
router.get('/:id', auth, async (request, response) => {
  const invitations = await invitationdb.getPendingInvitationsByUserId(
    request.params.id
  );

  const invitationList = await invitationService.createInvitations(invitations);
  // Format invitation Response

  console.log('invitationlist', invitationList);
  if (invitationList !== null) {
    return response.json(invitationList);
  }
  return response.status(400).json(invitationList);
});

/**
 * Update invitation answer of user
 * Method: PATCH
 * @returns {Object} Created challange
 */
router.patch('/answer', auth, async (request, response) => {
  try {
    const updatedInvitation = await invitationService.updateInvitationAnswer(
      request.body.id,
      request.body.answer
    );
    // TODO should answered invitations be deleted from the db?

    return response.json(updatedInvitation);
  } catch (error) {
    return response.status(400).json('error');
  }
});

module.exports = router;
