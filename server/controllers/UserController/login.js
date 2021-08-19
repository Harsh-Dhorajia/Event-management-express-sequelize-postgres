/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const {
  validateLoginInput,
} = require('../../utils/validators/userValidators');
const { generateToken } = require('../../utils/generateToken');
const { USER_NOT_FOUND, USER_LOGIN_SUCCESS, INVALID_USER_OR_PASSWORD } = require('../../constants/messages');

module.exports = {

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { isValid, error } = await validateLoginInput(email, password);
      if (error || !isValid) {
        return res.json({ message: error.details.map(e => e.message) });
      }
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: USER_NOT_FOUND });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: INVALID_USER_OR_PASSWORD });
      }

      const token = await generateToken(user);
      return res.send({
        message: USER_LOGIN_SUCCESS,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      return res.send(error);
    }
  },
};
