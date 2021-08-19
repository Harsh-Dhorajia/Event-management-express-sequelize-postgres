/* eslint-disable no-shadow */
const { User } = require('../../models');
const { Event } = require('../../models');
const { Guest } = require('../../models');
const {
  validateInviteInput,
} = require('../../utils/validators/eventValidator');

module.exports = {
  async inviteUser(req, res) {
    const { id } = req.user;
    const { email } = req.body;
    const { isValid, error } = await validateInviteInput(email);
    if (!isValid || error) {
      return res.json({ message: error.details.map(e => e.message) });
    }
    try {
      const owner = await User.findByPk(id);
      if (owner.email === email) {
        return res.json({
          message: 'Email is same as your email. Please try another email',
        });
      }
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.json({
          message:
            'Please enter email who is registered user on event management',
        });
      }
      const event = await Event.findByPk(req.params.eventId);
      if (!event) {
        return res.json({ message: 'Event not found' });
      }

      if (id !== event.userId) {
        return res.json({ message: 'You are not allow to invite users' });
      }
      const userAlreadyInvited = await Guest.findAll({
        where: {
          eventId: req.params.eventId,
          userId: user.id,
        },
      });

      if (userAlreadyInvited.length >= 1) {
        return res.json({ message: 'This email is already invited' });
      }
      await Guest.create({
        eventId: req.params.eventId,
        userId: user.id,
        invitedBy: owner.email,
      });
      return res.json({
        message: 'Invited Successfully',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json({ message: 'Something went wrong' });
    }
  }
};
