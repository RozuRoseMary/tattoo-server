const jwt = require("jsonwebtoken");
const { User } = require("../models");
const createError = require("../utils/createError");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      createError("You are unauthorized", 401);
    }
    const [, token] = authorization.split(" ");
    if (!token) {
      createError("You are unauthorized", 401);
    }
    const secretKey = process.env.JWT_SECRET_KEY || "123456";
    const payload = jwt.verify(token, secretKey);

    const user = await User.findOne({
      where: { id: payload.id },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      createError("user not found", 400);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
