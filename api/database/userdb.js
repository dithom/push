import User from '../model/User';

async function getUserById(userid) {
  try {
    const user = await User.findOne({
      _id: userid,
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function getUserByName(name) {
  try {
    const user = await User.findOne({
      username: name,
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function findByIdAndArchive(userid) {
  try {
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userid },
      {
        archived: true,
      }
    );
    return updatedUser;
  } catch (error) {
    return error;
  }
}

async function getAllUsers() {
  try {
    // Update user
    const Users = await User.find();
    return Users;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getUserById,
  findByIdAndArchive,
  getAllUsers,
  getUserByName,
};
