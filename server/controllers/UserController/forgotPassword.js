/* eslint-disable no-shadow */
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const { User } = require('../../models');
const {
  validateForgotPasswordInput,
} = require('../../utils/validators/userValidators');
const { USER_NOT_FOUND, RESET_PASSWORD_REQUEST_SUCCESS } = require('../../constants/messages');

module.exports = {

  async forgotPassword(req, res) {
    const { email } = req.body;

    const { isValid, error } = await validateForgotPasswordInput(email);
    if (!isValid || error) {
      return res.json({ message: error.details.map(e => e.message) });
    }
    try {
      const user = await User.findOne({ where: { email } });
      if (user) {
        const token = uuidv4();
        // save token and expire time
        await user.update({
          resetPasswordToken: token,
          resetPasswordExpires: dayjs().add(10, 'minutes').format(),
        });
        return res.json({
          message: RESET_PASSWORD_REQUEST_SUCCESS,
        });
      }
      return res.json({ message: USER_NOT_FOUND });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      return res.json(error);
    }
  },
};
