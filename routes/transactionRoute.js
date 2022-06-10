const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// create transaction
router.post("/:productId", transactionController.createTransaction);
router.patch("/:productId", transactionController.updateTransaction);
router.delete("/:productId", transactionController.deleteTransaction);

module.exports = router;
