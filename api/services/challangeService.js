// Import models
import challangeLeaderboarddb from '../database/challangeLeaderboarddb';

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

module.exports = {
  calculateAmountOfRepetitions,
};
