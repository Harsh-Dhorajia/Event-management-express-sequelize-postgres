/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const {
  validateRegisterInput,
} = require('../../utils/validators/userValidators');
const { generateToken } = require('../../utils/generateToken');

module.exports = {
  async register(req, res) {
    try {
      const { username, email } = req.body;
      let { password } = req.body;
      const { isValid, error } = await validateRegisterInput(
        username,
        email,
        password,
      );
      if (error || !isValid) {
        return res.json({ message: error.details.map(e => e.message) });
      }
      const userAlreadyExist = await User.findOne({ where: { email } });

      if (userAlreadyExist) {
        return res.json({ message: 'User Already Exist' });
      }
      password = await bcrypt.hash(password, 12);
      const user = await User.create({
        username,
        email,
        password,
      });
      if (!user) {
        return res.send({
          message: 'Error while register',
        });
      }
      const token = await generateToken(user);
      return res.send({
        message: 'User registered successfully',
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
