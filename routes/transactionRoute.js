const express = require("express");
const upload = require("../middlewares/upload");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/getOne/:id", transactionController.getTransactionById);

router.get(
  "/meReceived/:userId",
  transactionController.getMyTransactionReceived
);
router.get("/mePaid/:userId", transactionController.getMyTransactionPaid);

router.post(
  "/:productId",
  upload.single("paymentPicture"),
  transactionController.createTransaction
);

router.patch("/:id", transactionController.updateTransaction);

router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
