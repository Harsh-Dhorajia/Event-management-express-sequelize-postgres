/* eslint-disable no-shadow */
const { User } = require('../../models');
const { Event } = require('../../models');
const { Guest } = require('../../models');

module.exports = {
  async getInvitedUsers(req, res) {
    try {
      const { id } = req.user;
      const event = await Event.findOne({
        where: { id: req.params.eventId, userId: id },
      });
      if (!event) {
        return res.json({ message: 'Event not found' });
      }
      const guests = await Guest.findAll({
        where: { eventId: event.id },
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['username', 'email'],
          },
        ],
      });
      return res.json({ message: 'Event details', data: guests });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong' });
    }
  },
};
