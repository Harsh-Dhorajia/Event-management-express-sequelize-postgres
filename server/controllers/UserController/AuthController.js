/* eslint-disable no-shadow */
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
const { User } = require('../../models');
const {
  validateRegisterInput,
  validateLoginInput,
  validateChangePasswordInput,
  validateResetPasswordInput,
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

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { isValid, error } = await validateLoginInput(email, password);
      if (error || !isValid) {
        return res.json({ message: error.details.map(e => e.message) });
      }
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: 'Email or password do not match' });
      }

      const token = await generateToken(user);
      return res.send({
        message: 'User is logged in successfully',
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

  async forgotPassword(req, res) {
    const { email } = req.body;

    const { isValid, error } = await validateResetPasswordInput(email);
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
  },

  async resetPassword(req, res) {
    const { password } = req.body;
    const { isValid, error } = await validateChangePasswordInput(password);
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
            message: 'Password reset successfully',
          });
        }
        return res.json({
          message: 'You are not authorize to reset the password',
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        return res.json({ message: 'Something went wrong' });
      }
    } else {
      return res.json({ message: error.details.map(e => e.message) });
    }
  },
};
