const bcrypt = require("bcryptjs");
const User = require("../../models").User;
const {
  validateRegisterInput,
  validateLoginInput,
  validateChangePasswordInput,
} = require("../../utils/validators/userValidators");
const { generateToken } = require("../../utils/generateToken");
module.exports = {
  async register(req, res) {
    try {
      let { username, email, password } = req.body;
      const { isValid, error } = await validateRegisterInput(
        username,
        email,
        password
      );
      if (error || !isValid) {
        return res.json({ message: error.details.map((e) => e.message) });
      }
      const userAlreadyExist = await User.findOne({ where: { email } });

      if (userAlreadyExist) {
        return res.json({ message: "User Already Exist" });
      }
      password = await bcrypt.hash(password, 12);
      const user = await User.create({
        username,
        email,
        password,
      });
      if (!user)
        return res.send({
          message: "Error while register",
        });
      const token = await generateToken(user);
      return res.send({
        message: "User registered successfully",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      console.log(`error`, error);
      return res.send(error);
    }
  },

  async login(req, res) {
    try {
      let { email, password } = req.body;
      const { isValid, error } = await validateLoginInput(email, password);
      if (error || !isValid) {
        return res.json({ message: error.details.map((e) => e.message) });
      }
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: "Email or password do not match" });
      }

      const token = await generateToken(user);
      return res.send({
        message: "User is loggedin successfully",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      console.log(`error`, error);
      return res.send(error);
    }
  },

  async changePassword(req, res) {
    try {
      let { currentPassword, newPassword } = req.body;
      const { isValid, error } = await validateChangePasswordInput(
        currentPassword,
        newPassword
      );
      if (error || !isValid) {
        return res.json({ message: error.details.map((e) => e.message) });
      }
      const { id } = req.user;

      const user = await User.findByPk(id);
      if (!user) {
        return res.send({ message: "User is not found" });
      }
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: "Current password does not match" });
      }
      await user.update({
        password: await bcrypt.hash(newPassword, 12),
      });
      return res.json({ message: "Password updated successfully " });
    } catch (error) {
      console.log(`error`, error);
      return res.send(error);
    }
  },
};
