const jwt = require("jsonwebtoken");

module.exports.authenticatedUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.json({
      message: `Authentication error. Token required.`,
    });
  }
  const token = req.headers.authorization.split("Bearer ")[1];
  const options = {
    expiresIn: "2d",
  };

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY, options);
    req.user = user;
    next();
  } catch (error) {
    return res.json({
      message: "You are not authorized to perform this action",
    });
  }
  
};
