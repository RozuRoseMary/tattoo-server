const express = require("express");
const upload = require("../middlewares/upload");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/:sellerId", transactionController.getTransactionBySellerId);

router.get("/:transactionId", transactionController.getTransactionById);

router.post(
  "/:productId",
  upload.single("payment"),
  transactionController.createTransaction
);

router.patch("/:productId", transactionController.updateTransaction);

router.delete("/:productId", transactionController.deleteTransaction);

module.exports = router;
