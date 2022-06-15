const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");
const authenticate = require("../middlewares/authenticate");
const router = express.Router();

// * GET USER
router.get("/me", authenticate, userController.getMe);
router.get("/:userId", userController.getUserById);

// * UPDATE PROFILE
router.patch(
  "/updateProfilePic",
  authenticate,
  upload.fields([{ name: "profilePicture", max: 1 }]),
  userController.updateProfilePicture
);
router.patch("/updateProfile", authenticate, userController.updateProfile);

// * PAYMENT
router.patch(
  "/updatePaymentPic/:userId",
  authenticate,
  upload.single("paymentPicture"),
  userController.updateProfilePicture
);

module.exports = router;
