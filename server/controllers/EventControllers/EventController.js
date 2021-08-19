/* eslint-disable no-shadow */
const { User } = require('../../models');
const { Event } = require('../../models');
const { Guest } = require('../../models');
const {
  validateEventInput,
  validateInviteInput,
} = require('../../utils/validators/eventValidator');
const { pagination } = require('../../utils/pagination');

module.exports = {
  async getAllCreatedEvents(req, res) {
    // http://localhost:5000/api/event/getAllCreatedEvents?sort=eventName:asc
    try {
      const { id } = req.user;
      const user = await User.findByPk(id);

      const {
        limit, offset, order, searchOpt,
      } = pagination(req);

      const events = await user.getEvents({
        where: { ...searchOpt, userId: id },
        limit,
        offset,
        order,
      });
      return res.json({
        data: events,
        message: 'User Events',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong' });
    }
  },

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
  },

  async getInvitedUsers(req, res) {
    try {
      const { id } = req.user;
      const event = await Event.findOne({ where: { id: req.params.eventId, userId: id } });
      if (!event) {
        return res.json({ message: 'Event not found' });
      }
      const guests = await Guest.findAll(
        {
          where: { eventId: event.id },
          include: [
            {
              model: User, as: 'users', attributes: ['username', 'email'],
            },
          ],
        },
      );
      return res.json({ message: 'Event details', data: guests });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong' });
    }
  },
};
