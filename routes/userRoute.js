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
router.post(
  "/payment",
  authenticate,
  upload.single("paymentPicture"),
  userController.createPayment
);

router.delete("/payment/:id", authenticate, userController.deletePaymentById);

router.get("/getMe/payments", authenticate, userController.getAllPaymentUserId);

router.get(
  "/paymentSellerId/:productId",
  authenticate,
  userController.getAllPaymentSellerId
);

module.exports = router;
