const express = require("express");
const productController = require("../controllers/productController");
const serviceController = require("../controllers/servicePriceController");
const upload = require("../middlewares/upload");

const router = express.Router();

// * product
router.get("/getAllProduct", productController.getAllProduct);

router.get("/:userId", productController.getProductByUserId);

router.post("/", upload.single("image"), productController.createProduct);

router.patch("/:id", upload.single("image"), productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

// * service price for tattooist only
router.post("/:productId/servicePrice", serviceController.createServicePrice);

router.patch("/:serviceId/servicePrice", serviceController.updateServicePrice);

router.delete("/:serviceId/servicePrice", serviceController.deleteServicePrice);

module.exports = router;
