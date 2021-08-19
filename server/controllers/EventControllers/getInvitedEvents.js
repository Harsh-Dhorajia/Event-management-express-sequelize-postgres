/* eslint-disable no-shadow */
const { User } = require('../../models');
const { Event } = require('../../models');
const { Guest } = require('../../models');

module.exports = {
  async getInvitedEvents(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findByPk(id);
      if (!user) {
        res.json({ message: 'User not found' });
      }
      // get all invited events
      const guest = await Guest.findAll({
        where: {
          userId: id,
        },
        include: Event,
      });
      return res.json({
        message: 'List of Invited Events',
        data: guest.map(event => event),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong' });
    }
  }
};
