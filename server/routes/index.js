const {
  register,
  login,
  changePassword,
} = require("../controllers/UserController/AuthController");
const {
  createEvent,
  inviteUser,
} = require("../controllers/EventControllers/EventController");
const { authenticatedUser } = require("../middleware/authenticatedUser");

module.exports = (app) => {
  // User Routes
  app.post("/api/register", register);
  app.post("/api/login", login);
  app.post("/api/change-password", authenticatedUser, changePassword);

  // Event Routes
  app.post("/api/event/create", authenticatedUser, createEvent);
  app.put("/api/event/:eventId", authenticatedUser, inviteUser);
};
