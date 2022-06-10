const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");
const router = express.Router();

router.get("/me", userController.getMe);
// TODO

router.get("/:userId", userController.getUserById);

router.patch(
  "/updateProfilePic",
  upload.fields([{ name: "profilePicture", max: 1 }]),
  userController.updateProfilePicture
);

router.patch("/updateProfile", userController.updateProfile);

module.exports = router;
