const fs = require("fs");
const createError = require("../utils/createError");
const { User, Product, Payment } = require("../models");
const cloudinary = require("../utils/cloudinary");
const { uploadToCloudinary } = require("../cloudinaryService/service");

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
      updateProfilePic.profilePicture = await uploadToCloudinary(
        req.files.profilePicture[0].path,
        req.user.profilePicture
      );
      // const result = await cloudinary.upload(req.files.profilePicture[0].path);
      // if (req.user.profilePicture) {
      //   const splitted = req.user.profilePicture.split("/");
      //   const publicId = splitted[splitted.length - 1].split(".")[0];
      //   await cloudinary.destroy(publicId);
      // }
      // updateProfilePic.profilePicture = result.secure_url;
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
    if (Object.keys(req.body).length === 0) {
      createError("Can not update empty dataaaaaaa", 400);
    }

    if (
      !firstName &&
      !lastName &&
      !displayName &&
      !phoneNumber &&
      !email &&
      !aboutMe &&
      !role &&
      !password &&
      !newPassword &&
      !confirmNewPassword
    ) {
      createError("Can not update empty data", 400);
    }

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
exports.createPayment = async (req, res, next) => {
  try {
    const { paymentData } = req.body;

    if (!req.file && !paymentData) {
      createError("Require payment", 400);
    }

    if (!req.file) {
      createError("Payment picture is require", 400);
    }

    if (!paymentData) {
      createError("You have to identified bank", 400);
    }

    let paymentPicture;
    if (req.file) {
      const res = await cloudinary.upload(req.file.path);
      paymentPicture = res.secure_url;
    }

    const payment = await Payment.create({
      userId: req.user.id,
      paymentPicture,
      paymentData,
    });

    res.json({ message: "Create payment success", payment });
  } catch (err) {
    next(err);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ where: { userId: req.user.id } });

    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

exports.getAllPaymentUserId = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
    });

    if (!payments) {
      createError("Can't found your payment", 400);
    }

    res.json({ payments });
  } catch (err) {
    next(err);
  }
};

exports.getAllPaymentSellerId = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      createError("Cannot find this product", 400);
    }

    let sellerId;
    if (product.tattooistId) {
      sellerId = product.tattooistId;
    } else sellerId = product.tattooerId;

    const payment = await Payment.findAll({
      where: { userId: sellerId },
    });

    res.json({ payment });
  } catch (err) {
    next(err);
  }
};

// exports.updatePayment = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   }
// };
