/* eslint-disable no-shadow */
const { User } = require('../../models');
const { Event } = require('../../models');
const { Guest } = require('../../models');
const { LIST_OF_INVITED_EVENTS, USER_NOT_FOUND } = require('../../constants/messages');

module.exports = {
  async getInvitedEvents(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findByPk(id);
      if (!user) {
        res.json({ message: USER_NOT_FOUND });
      }
      // get all invited events
      const guest = await Guest.findAll({
        where: {
          userId: id,
        },
        include: Event,
      });
      return res.json({
        message: LIST_OF_INVITED_EVENTS,
        data: guest.map(event => event),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json(error);
    }
  },
};
