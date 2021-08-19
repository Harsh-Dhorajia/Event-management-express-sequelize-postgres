/* eslint-disable no-shadow */
const { User } = require('../../models');

const {
  validateEventInput,
} = require('../../utils/validators/eventValidator');

module.exports = {
  async createEvent(req, res) {
    const { eventName, date, description } = req.body;
    const { isValid, error } = await validateEventInput(
      eventName,
      date,
      description,
    );
    if (!isValid || error) {
      return res.json({ message: error.details.map(e => e.message) });
    }
    const { id } = req.user;
    try {
      const user = await User.findByPk(id);
      // using the mixin methods to create event
      const event = await user.createEvent({
        eventName,
        date,
        description,
        addedBy: user.username,
        userId: user.id,
      });

      return res.json({
        data: event,
        message: 'Event created successfully',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong !' });
    }
  }
}
