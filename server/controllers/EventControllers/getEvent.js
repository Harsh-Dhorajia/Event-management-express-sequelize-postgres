/* eslint-disable no-shadow */
const { User } = require('../../models');
const { Event } = require('../../models');

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
      if (!event) return res.json({ message: 'Event not found' });

      return res.json({ message: 'Event details', data: event });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong' });
    }
  }
};
