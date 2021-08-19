/* eslint-disable no-shadow */
const { Event } = require('../../models');
const {
  validateEventInput,
} = require('../../utils/validators/eventValidator');
const { EVENT_NOT_FOUND, PERMISSION_NOT_FOUND, EVENT_UPDATED } = require('../../constants/messages');

module.exports = {
  async updateEventDetail(req, res) {
    const { eventName, date, description } = req.body;
    const { isValid, error } = await validateEventInput(
      eventName,
      date,
      description,
    );
    if (!isValid || error) {
      return res.json({ message: error.details.map(e => e.message) });
    }
    try {
      const { id } = req.user;

      // get given event
      const event = await Event.findByPk(req.params.eventId);

      if (!event) {
        return res.json({
          message: EVENT_NOT_FOUND,
        });
      }
      // verify the valid user to update the event
      if (event.userId !== id) {
        return res.json({
          message: PERMISSION_NOT_FOUND,
        });
      }
      await event.update({
        eventName,
        description,
        date,
      });
      return res.json({ message: EVENT_UPDATED, data: event });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json(error);
    }
  },
};
