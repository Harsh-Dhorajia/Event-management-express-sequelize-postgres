const User = require("../../models").User;
const Event = require("../../models").Event;
const Guest = require("../../models").Guest;
const {
  validateEventInput,
  validateInviteInput,
} = require("../../utils/validators/eventValidator");
const { pagination } = require("../../utils/pagination");

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
      if (owner.email === email) {
        return res.json({
          message: "Email is same as your email. Please try another email",
        });
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

  async updateEventDetail(req, res) {
    const { eventName, date, description } = req.body;
    const { isValid, error } = await validateEventInput(
      eventName,
      date,
      description
    );
    if (!isValid || error) {
      return res.json({ message: error.details.map((e) => e.message) });
    }
    try {
      const { id } = req.user;

      // get given event
      const event = await Event.findByPk(req.params.eventId);

      if (!event) {
        return res.json({
          message: "Event not found",
        });
      }
      // verify the valid user to update the event
      if (event.userId !== id) {
        return res.json({
          message: "Only event creators are allow to update the event details",
        });
      }
      await event.update({
        eventName,
        description,
        date,
      });
      return res.json({ message: "Event updated successfully", data: event });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Something went wrong" });
    }
  },

  async getAllEvents(req, res) {
    const { limit, offset, order, searchOpt } = pagination(req);

    const events = await Event.findAll({
      where: searchOpt,
      limit,
      offset,
      order,
    });
    res.json({ message: "All Events List", payload: events });
  },

  async getInvitedEvents(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findByPk(id);
      if (!user) {
        res.json({ message: "User not found" });
      }
      // get all invited events
      const guest = await Guest.findAll({
        where: {
          userId: id,
        },
        include: Event,
      });
      return res.json({
        message: "List of Invited Events",
        data: guest.map((event) => {
          return event;
        }),
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Something went wrong" });
    }
  },

  async getAllCreatedEvents(req, res) {
    // http://localhost:5000/api/event/getAllCreatedEvents?sort=eventName:asc
    try {
      const { id } = req.user;
      const user = await User.findByPk(id);

      const { limit, offset, order, searchOpt } = pagination(req);

      const events = await user.getEvents({
        where: searchOpt,
        limit,
        offset,
        order,
      });
      return res.json({
        data: events,
        message: "User Events",
      });
    } catch (error) {
      console.log(error);
      res.json({ message: "Something went wrong" });
    }
  },

  async eventDetail(req, res) {
    try {
      // Get event detail with their invited users
      const event = await Event.findByPk(req.params.eventId, {
        include: [
          { model: User, as: "users", attributes: ["username", "email"] },
        ],
        attributes: ["eventName"],
      });
      if (!event) return res.json({ message: "Event not found" });

      res.json({ message: "Event details", data: event });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Something went wrong" });
    }
  },

  async getInvitedUsers(req, res) {
    try {
      const { id } = req.user;
      const event = await Event.findOne({ where: { id: req.params.eventId, userId: id }});
      if(!event) {
        return res.json({ message: "Event not found" });
      }
      const guests = await Guest.findAll(
        {
          where: { eventId: event.id },
            include: [
            {
              model: User, as: "users", attributes: ["username", "email"]
            },
          ],
    });
      return res.json({ message: "Event details", data: guests });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Something went wrong" });
    }
  }
};
