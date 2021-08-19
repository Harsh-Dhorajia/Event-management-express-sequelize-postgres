/* eslint-disable no-shadow */
const { User } = require('../../models');
const { pagination } = require('../../utils/pagination');
const { CREATED_EVENTS } = require('../../constants/messages');

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
        message: CREATED_EVENTS,
        data: events,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong' });
    }
  },
};
