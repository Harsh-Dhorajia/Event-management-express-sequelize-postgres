/* eslint-disable no-shadow */
const { Event } = require('../../models');
const { pagination } = require('../../utils/pagination');
const { EVENT_LIST } = require('../../constants/messages');

module.exports = {
  async getAllEvents(req, res) {
    try {
      const {
        limit, offset, order, searchOpt,
      } = pagination(req);

      const events = await Event.findAll({
        where: searchOpt,
        limit,
        offset,
        order,
      });
      return res.json({ message: EVENT_LIST, payload: events });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json(error);
    }
  },
};
