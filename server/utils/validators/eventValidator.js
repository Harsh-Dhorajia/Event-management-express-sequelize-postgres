const Joi = require('joi');
const { SERVER_ERROR } = require('../../constants/messages');

module.exports.validateEventInput = async (eventName, date, description) => {
  const eventSchema = Joi.object().keys({
    eventName: Joi.string().min(3).required(),
    date: Joi.string().required(),
    description: Joi.string().required(),
  });
  try {
    const { error } = await eventSchema.validate(
      {
        eventName,
        date,
        description,
      },
      { abortEarly: false },
    );
    if (error) {
      return { isValid: false, error };
    }
    return { isValid: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return { message: SERVER_ERROR };
  }
};

module.exports.validateInviteInput = async email => {
  const resetPasswordSchema = Joi.object().keys({
    email: Joi.string().email().required(),
  });
  try {
    const { error } = await resetPasswordSchema.validate(
      {
        email,
      },
      { abortEarly: false },
    );
    if (error) {
      return { isValid: false, error };
    }
    return { isValid: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return { message: SERVER_ERROR };
  }
};
