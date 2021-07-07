// Import database repos
import challangedb from '../database/challangedb';
// Import Service Functions
import formatDateService from './formatDateService';

function calculateAmountOfRepetitions(
  startDate,
  endDate,
  timespan,
  repetitions
) {
  const TIMESPAN_DAY = 'day';
  const TIMESPAN_MONTH = 'month';
  const TIMESPAN_WEEK = 'week';

  let totalAmountOfRepetitions = 0;
  // calculate time difference
  const timeDifference = endDate.getTime() - startDate.getTime();

  // calculate days difference by dividing total milliseconds in a day
  const differenceOfDays = timeDifference / (1000 * 60 * 60 * 24);
  let months = differenceOfDays / 30;
  let weeks = differenceOfDays / 7;
  switch (timespan) {
    case TIMESPAN_DAY:
      totalAmountOfRepetitions = differenceOfDays * repetitions;
      break;
    case TIMESPAN_MONTH:
      months = Math.round(months * 10) / 10; // eine nachkommastelle
      totalAmountOfRepetitions = Math.round(months * repetitions);
      break;
    case TIMESPAN_WEEK: // 7 pro woche, 3 pro woche
      weeks = Math.round(weeks * 10) / 10; // eine nachkommastelle
      totalAmountOfRepetitions = Math.round(weeks * repetitions);
      break;
    default:
      console.log("can't calculate interval, timespan not known");
  }

  return totalAmountOfRepetitions;
}

async function identifyCurrentInterval(challangeId) {
  let challange = 0;
  try {
    challange = await challangedb.getChallangeById(challangeId);
  } catch (error) {
    console.log(error);
  }
  // get time difference between challange start and today
  const dateArray = formatDateService.formatDate(
    challange.startDate,
    challange.endDate
  );
  const startDate = dateArray[0];
  const today = dateArray[2];

  const timeDifference = today.getTime() - startDate.getTime();

  const TIMESPAN_DAY = 'day';
  const TIMESPAN_MONTH = 'month';
  const TIMESPAN_WEEK = 'week';

  // calculate days difference by dividing total milliseconds in a day
  const differenceOfDays = timeDifference / (1000 * 60 * 60 * 24);

  let currentInterval = 0;

  const months = differenceOfDays / 30;
  const weeks = differenceOfDays / 7;
  switch (challange.timespan) {
    case TIMESPAN_DAY:
      currentInterval = differenceOfDays;
      break;
    case TIMESPAN_MONTH:
      currentInterval = Math.floor(months);
      break;
    case TIMESPAN_WEEK: // 7 pro woche, 3 pro woche
      currentInterval = Math.floor(weeks);
      break;
    default:
      console.log("can't calculate interval, timespan not known");
  }
  // am ersten Tag der challange ist es trotzdem schon das erste interval
  return currentInterval;
}

module.exports = {
  calculateAmountOfRepetitions,
  identifyCurrentInterval,
};
