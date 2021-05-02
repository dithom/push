const jwt = require('jsonwebtoken');

const auth = (request, response, next) => {
  const token = request.header('auth-token');

  if (!token) {
    return response.status(401).json({
      error: 'Access denied'
    })
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    request.user = verifiedUser;
    next();
  } catch(error) {
    return response.status(400).json({
      error: 'Token not valid.'
    });
  }
}

module.exports = auth;