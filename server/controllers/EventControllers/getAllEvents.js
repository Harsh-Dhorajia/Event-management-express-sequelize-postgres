/* eslint-disable no-shadow */
const { Event } = require('../../models');
const { pagination } = require('../../utils/pagination');

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
      res.json({ message: 'All Events List', payload: events });
    } catch (error) {
       // eslint-disable-next-line no-console
       console.log(error);
       return res.json({ message: 'Something went wrong' });
    }
  }
};
