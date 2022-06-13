const express = require("express");
const productController = require("../controllers/productController");
const serviceController = require("../controllers/servicePriceController");
const authenticate = require("../middlewares/authenticate");

const upload = require("../middlewares/upload");

const router = express.Router();

// * product
router.get("/getAllProduct", productController.getAllProduct);

router.get("/:userId", productController.getProductByUserId);

router.get("/oneProduct/:productId", productController.getProductById);

router.post(
  "/",
  authenticate,
  upload.single("image"),
  productController.createProduct
);

router.patch(
  "/:id",
  authenticate,
  upload.single("image"),
  productController.updateProduct
);

router.delete("/:id", authenticate, productController.deleteProduct);

// * service price for tattooist only
router.post(
  "/:productId/servicePrice",
  authenticate,
  serviceController.createServicePrice
);

router.patch(
  "/:serviceId/servicePrice",
  authenticate,
  serviceController.updateServicePrice
);

router.delete(
  "/:serviceId/servicePrice",
  authenticate,
  serviceController.deleteServicePrice
);

module.exports = router;
