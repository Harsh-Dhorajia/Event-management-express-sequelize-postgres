/* eslint-disable no-shadow */
const { User } = require('../../models');
const { Event } = require('../../models');
const { EVENT_NOT_FOUND, EVENT_DETAILS } = require('../../constants/messages');

module.exports = {
  async eventDetail(req, res) {
    try {
      // Get event detail with their invited users
      const event = await Event.findByPk(req.params.eventId, {
        include: [
          { model: User, as: 'users', attributes: ['username', 'email'] },
        ],
        attributes: ['eventName'],
      });
      if (!event) return res.json({ message: EVENT_NOT_FOUND });

      return res.json({ message: EVENT_DETAILS, data: event });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json(error);
    }
  },
};
