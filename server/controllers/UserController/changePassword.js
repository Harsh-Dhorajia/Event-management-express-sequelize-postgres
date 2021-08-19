/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const {
  validateChangePasswordInput,
} = require('../../utils/validators/userValidators');
const { USER_NOT_FOUND, PASSWORD_NOT_MATCH, PASSWORD_CHANGED } = require('../../constants/messages');

module.exports = {
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const { isValid, error } = await validateChangePasswordInput(
        currentPassword,
        newPassword,
      );
      if (error || !isValid) {
        return res.json({ message: error.details.map(e => e.message) });
      }
      const { id } = req.user;

      const user = await User.findByPk(id);
      if (!user) {
        return res.send({ message: USER_NOT_FOUND });
      }
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: PASSWORD_NOT_MATCH });
      }
      await user.update({
        password: await bcrypt.hash(newPassword, 12),
      });
      return res.json({ message: PASSWORD_CHANGED });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      return res.send(error);
    }
  },
};
