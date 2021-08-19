/* eslint-disable no-shadow */
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const { User } = require('../../models');
const {
  validateForgotPasswordInput
} = require('../../utils/validators/userValidators');

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
          message: 'Reset password link send to on your registered email',
        });
      }
      return res.json({ message: 'Email is not exist.' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      return res.json({ message: 'Something went wrong' });
    }
  }
};
