// Import Db Functions
import userdb from '../database/userdb';

function mapUsernamesToIds(competitors) {
  const competitorIds = [];
  for (let i = 0; i < competitors.length; i++) {
    competitorIds.push(competitors[i]._id);
  }
  return competitorIds;
}

module.exports = {
  mapUsernamesToIds,
};
