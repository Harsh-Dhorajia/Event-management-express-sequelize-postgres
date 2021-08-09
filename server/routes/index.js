const authController = require("../controllers/UserController/AuthController");

module.exports = (app) => {
  // User Routes

  app.post("/api/register", authController.register);
  app.post("/api/login", authController.login);
  
};