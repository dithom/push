import moment from 'moment';

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('MM/DD/YYYY h:mm a'),
  };
}

function formatLeaderboardRow(
  userName,
  totalRepetitions,
  currentIntervalRepetitions
) {
  return {
    username: userName,
    totalrepetitions: totalRepetitions,
    currentIntervalRepetitions,
  };
}

module.exports = { formatMessage, formatLeaderboardRow };
