const { register, login, changePassword } = require("../controllers/UserController/AuthController");
const {authenticatedUser}  = require("../middleware/authenticatedUser");

module.exports = (app) => {
  // User Routes

  app.post("/api/register", register);
  app.post("/api/login", login);
  app.post(
    "/api/change-password",
    authenticatedUser,
    changePassword
  );
};
