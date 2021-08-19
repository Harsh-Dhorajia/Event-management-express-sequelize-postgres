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
          message: 'Event not found',
        });
      }
      // verify the valid user to update the event
      if (event.userId !== id) {
        return res.json({
          message: 'Only event creators are allow to update the event details',
        });
      }
      await event.update({
        eventName,
        description,
        date,
      });
      return res.json({ message: 'Event updated successfully', data: event });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong' });
    }
  }
};
