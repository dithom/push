async function createLeaderboard(Users) {
  const highscoreList = [];

  // get only the username and his/her score
  for (let i = 0; i < Users.length; i++) {
    const item = Users[i];
    const userScore = { username: item.username, highscore: item.highscore };
    highscoreList.push(userScore);
  }

  // sort by highscore in descending order
  highscoreList.sort(
    (a, b) => parseFloat(b.highscore) - parseFloat(a.highscore)
  );
  return highscoreList;
}

module.exports = {
  createLeaderboard,
};
