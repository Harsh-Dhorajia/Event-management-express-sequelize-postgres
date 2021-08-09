const User = require("../../models").User;
const Event = require("../../models").Event;
const Guest = require("../../models").Guest;
const { validateEventInput,validateInviteInput } = require("../../utils/validators/eventValidator");

module.exports = {
  async createEvent(req, res) {
    let { eventName, date, description } = req.body;
    const { isValid, error } = await validateEventInput(
      eventName,
      date,
      description
    );
    if (!isValid || error) {
      return res.json({ message: error.details.map((e) => e.message) });
    }
    const { id } = req.user;
    try {
      const user = await User.findByPk(id);
      const event = await Event.create({
        eventName,
        date,
        description,
        addedBy: user.username,
        userId: user.id,
      });

      return res.json({
        data: event,
        message: "Event created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Something went wrong !" });
    }
  },

  async inviteUser(req, res) {
    const { id } = req.user;
    const { email } = req.body;
    const { isValid, error } = await validateInviteInput(email);
    if (!isValid || error) {
      return res.json({ message: error.details.map((e) => e.message) });
    }
    try {
      const owner = await User.findByPk(id);
      if(owner.email === email) {
        return res.json({ message: "Email is same as your email. Please try another email" });
      }
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.json({
          message:
            "Please enter email who is registered user on event management",
        });
      }
      const event = await Event.findByPk(req.params.eventId);
      if (!event) {
        return res.json({ message: "Event not found" });
      }

      if (id !== event.userId) {
        return res.json({ message: "You are not allow to invite users" });
      }
      const userAlreadyInvited = await Guest.findAll({
        where: {
          invitedUserEmail: email,
          eventId: req.params.eventId,
        },
      });

      if (userAlreadyInvited.length >= 1) {
        return res.json({ message: "This email is already invited" });
      }
      const guest = await Guest.create({
        eventId: req.params.eventId,
        userId: user.id,
        invitedUserEmail: email,
      });
      return res.json({
        data: guest,
        message: "Invited Successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Something went wrong" });
    }
  },
};
