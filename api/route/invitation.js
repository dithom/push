import express from 'express';
import { body, validationResult } from 'express-validator';

// Import middleware
import auth from '../middleware/auth';

// Import models
import Challange from '../model/Challange';

// Import Db Functions
import invitationdb from '../database/invitationdb';
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';

// Import Services
import invitationService from '../services/invitationService';

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

    // add competitor to challange schema if challange was accepted

    // find and update challange by id
    const filter = { _id: updatedInvitation.challange };
    const update = { competitors: updatedInvitation.receiver };
    // update attendee array in collection
    const challanges = await Challange.findOneAndUpdate(filter, update);

    return response.json(updatedInvitation);
  } catch (error) {
    return response.status(400).json('error');
  }
});

module.exports = router;
