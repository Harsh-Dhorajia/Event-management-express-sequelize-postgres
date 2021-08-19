/* eslint-disable no-shadow */
const { User } = require('../../models');
const { Event } = require('../../models');
const { Guest } = require('../../models');
const {
  validateInviteInput,
} = require('../../utils/validators/eventValidator');
const {
  EVENT_NOT_FOUND,
  USER_NOT_REGISTERED,
  PERMISSION_NOT_FOUND,
  EMAIL_ALREADY_INVITED,
  INVITES_OWN,
  INVITE_SUCCESS,
} = require('../../constants/messages');

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
          message: INVITES_OWN,
        });
      }
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.json({
          message: USER_NOT_REGISTERED,
        });
      }
      const event = await Event.findByPk(req.params.eventId);
      if (!event) {
        return res.json({ message: EVENT_NOT_FOUND });
      }

      if (id !== event.userId) {
        return res.json({ message: PERMISSION_NOT_FOUND });
      }
      const userAlreadyInvited = await Guest.findAll({
        where: {
          eventId: req.params.eventId,
          userId: user.id,
        },
      });

      if (userAlreadyInvited.length >= 1) {
        return res.json({ message: EMAIL_ALREADY_INVITED });
      }
      await Guest.create({
        eventId: req.params.eventId,
        userId: user.id,
        invitedBy: owner.email,
      });
      return res.json({
        message: INVITE_SUCCESS,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.json(error);
    }
  },
};
