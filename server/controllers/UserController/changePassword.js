/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const {
  validateChangePasswordInput,
} = require('../../utils/validators/userValidators');
const { generateToken } = require('../../utils/generateToken');

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
        return res.send({ message: 'User is not found' });
      }
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: 'Current password does not match' });
      }
      await user.update({
        password: await bcrypt.hash(newPassword, 12),
      });
      return res.json({ message: 'Password updated successfully ' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      return res.send(error);
    }
  },
};
