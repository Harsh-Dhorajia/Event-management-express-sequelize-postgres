const { createEvent } = require('./create');
const { getAllEvents } = require('./getAllEvents');
const { getAllCreatedEvents } = require('./getCreatedEvent');
const { eventDetail } = require('./getEvent');
const { getInvitedEvents } = require('./getInvitedEvents');
const { getInvitedUsers } = require('./getInvitedUsers');
const { inviteUser } = require('./inviteUser');
const { updateEventDetail } = require('./updateEventDetail');

module.exports = {
  createEvent,
  getAllEvents,
  getAllCreatedEvents,
  eventDetail,
  getInvitedEvents,
  getInvitedUsers,
  inviteUser,
  updateEventDetail,
};
