const fs = require("fs");
const createError = require("../utils/createError");
const { User } = require("../models");
const cloudinary = require("../utils/cloudinary");

// * GET PROFILE
exports.getMe = async (req, res, next) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      createError("User not found", 400);
    }

    const result = JSON.parse(JSON.stringify(user));
    res.json({ user: result });
  } catch (err) {
    next(err);
  }
};

// * UPDATE _ DELETE PROFILE
exports.updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.files) {
      createError("profilePicture is required", 400);
    }

    const updateProfilePic = {};
    if (req.files.profilePicture) {
      const result = await cloudinary.upload(req.files.profilePicture[0].path);
      if (req.user.profilePicture) {
        const splitted = req.user.profilePicture.split("/");
        const publicId = splitted[splitted.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      updateProfilePic.profilePicture = result.secure_url;
    }

    await User.update(updateProfilePic, { where: { id: req.user.id } });
    res
      .status(200)
      .json({ message: "Upload profile picture success", ...updateProfilePic });
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profilePicture) {
      fs.unlinkSync(req.files.profilePicture[0].path);
    }
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      displayName,
      phoneNumber,
      email,
      aboutMe,
      role,
      password,
      newPassword,
      confirmNewPassword,
    } = req.body;

    const user = await User.findOne({ where: { id: req.user.id } });

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (displayName) {
      user.displayName = displayName;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    if (email) {
      user.email = email;
    }

    if (aboutMe) {
      user.aboutMe = aboutMe;
    }

    if (role) {
      user.role = role;
    }

    if (newPassword) {
      user.password = newPassword;
    }

    await user.save();
    res.json({ message: "update success", user });
  } catch (err) {
    next(err);
  }
};

// * PAYMENT
exports.updatePaymentPic = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
