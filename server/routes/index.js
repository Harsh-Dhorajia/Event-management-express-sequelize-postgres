const {
  changePassword,
  forgotPassword,
  login,
  register,
  resetPassword,
} = require('../controllers/UserController');
const {
  createEvent,
  getAllEvents,
  getAllCreatedEvents,
  eventDetail,
  getInvitedEvents,
  getInvitedUsers,
  inviteUser,
  updateEventDetail,
} = require('../controllers/EventControllers');
const { authenticatedUser } = require('../middleware/authenticatedUser');

module.exports = app => {
  // User Routes
  app.post('/api/register', register);
  app.post('/api/login', login);
  app.post('/api/change-password', authenticatedUser, changePassword);
  app.post('/api/forgot-password', forgotPassword);
  app.put('/api/reset-password/:token', resetPassword);

  // Event Routes
  app.post('/api/event/create', authenticatedUser, createEvent);
  app.put('/api/event/inviteUser/:eventId', authenticatedUser, inviteUser);
  app.put('/api/event/update/:eventId', authenticatedUser, updateEventDetail);

  app.get('/api/event/get-all-events', getAllEvents);
  app.get('/api/event/invited-events', authenticatedUser, getInvitedEvents);
  app.get(
    '/api/event/get-all-created-events',
    authenticatedUser,
    getAllCreatedEvents,
  );
  app.get('/api/event/details/:eventId', authenticatedUser, eventDetail);
  app.get('/api/event/invited-users/:eventId', authenticatedUser, getInvitedUsers);
};
