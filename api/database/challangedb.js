import Challange from '../model/Challange';

async function getChallangeById(challangeid) {
  try {
    const challange = await Challange.findOne({
      _id: challangeid,
    });
    return challange;
  } catch (error) {
    return error;
  }
}

async function getChallangeByName(challangeName) {
  try {
    const challange = await Challange.findOne({
      name: challangeName,
    });
    return challange;
  } catch (error) {
    return error;
  }
}

async function getActiveChallangesOfUser(userid) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // get all challanges associated to signed in user
  try {
    const challanges = await Challange.find({
      $or: [
        {
          creator: userid,
        },
        {
          competitors: userid,
        },
      ],
      $and: [{ endDate: { $gte: today } }],
    });
    return challanges;
  } catch (error) {
    return 'error';
  }
}

async function getArchivedChallangesOfUser(userid) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // get all challanges associated to signed in user
  try {
    const challanges = await Challange.find({
      $or: [
        {
          creator: userid,
        },
        {
          competitors: userid,
        },
      ],
      $and: [{ endDate: { $lt: today } }],
    });

    return challanges;
  } catch (error) {
    return 'error';
  }
}

async function createNewChallange(
  request,
  totalAmountOfRepetitions,
  amountOfIntervals
) {
  const newChallange = new Challange({
    name: request.body.name,
    description: request.body.description,
    category: request.body.category,
    startDate: request.body.startDate,
    endDate: request.body.endDate,
    repetitions: request.body.repetitions,
    maximumRepetitions: totalAmountOfRepetitions,
    intervals: amountOfIntervals,
    timespan: request.body.timespan,
    creator: request.userId,
    visibility: request.body.visibility,
    competitors: request.body.competitors,
  });
  try {
    const savedChallange = await newChallange.save();
    return savedChallange;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getActiveChallangesOfUser,
  getChallangeByName,
  getArchivedChallangesOfUser,
  createNewChallange,
  getChallangeById,
};
