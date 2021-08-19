/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const { User } = require('../../models');
const {
  validateResetPasswordInput,
} = require('../../utils/validators/userValidators');
const { RESET_PASSWORD_SUCCESS, RESET_PASSWORD_LINK_EXPIRE } = require('../../constants/messages');

module.exports = {
  async resetPassword(req, res) {
    const { password } = req.body;
    const { isValid, error } = await validateResetPasswordInput(password);
    if (isValid) {
      try {
        const user = await User.findOne({
          where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
              [Op.gt]: dayjs().format(),
            },
          },
        });
        if (user) {
          await user.update({
            password: await bcrypt.hash(password, 12),
            resetPasswordToken: null,
            resetPasswordExpires: null,
          });
          return res.json({
            message: RESET_PASSWORD_SUCCESS,
          });
        }
        return res.json({
          message: RESET_PASSWORD_LINK_EXPIRE,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        return res.json(error);
      }
    } else {
      return res.json({ message: error.details.map(e => e.message) });
    }
  },
};
