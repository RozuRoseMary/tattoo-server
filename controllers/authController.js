const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const genToken = (payload) => {
  // console.log(payload);
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// * REGISTER
exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      email,
      username,
      password,
      confirmPassword,
      role,
    } = req.body;

    if (password !== confirmPassword) {
      createError("Password and Confirm password is not match", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      email,
      username,
      password: hashedPassword,
      role,
    });

    // console.log(user.id);

    const token = genToken({ id: user.id });

    res.status(201).json({ message: "Register Success", token });
  } catch (err) {
    next(err);
  }
};

// * LOGIN
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      createError("invalid credential", 400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      createError("invalid credential", 400);
    }
    const token = genToken({ id: user.id });
    res.json({ message: "Login success", token });
  } catch (err) {
    next(err);
  }
};
