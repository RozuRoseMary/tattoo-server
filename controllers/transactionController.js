const { User, Product, Transaction } = require("../models");
const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");

exports.getTransactionById = async (req, res, next) => {
  try {
    res.json();
  } catch (err) {
    next(err);
  }
};

exports.getTransactionBySellerId = async (req, res, next) => {
  try {
    res.json();
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { productId: id } = req.params;
    const { clientId } = req.body;

    const product = await Product.findOne({ where: { id } });

    if (!product) {
      createError("Can not found this product", 400);
    }

    if (product.tattooistId === +clientId || product.tattooerId === +clientId) {
      createError("You can not buy your product", 400);
    }

    if (product.status === "AVAILABLE") {
      product.status = "PENDING";
      await product.save();
    } else {
      createError("This product not available.");
    }

    let payment;
    if (req.file) {
      const res = await cloudinary.upload(req.file.path);
      payment = res.secure_url;
    }

    const transaction = await Transaction.create({
      productId: product.id,
      clientId,
      payment,
    });

    res.json({ message: "Create Transaction success", transaction });
  } catch (err) {
    next(err);
  }
};

// TODO
exports.updateTransaction = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;

    const product = await Product.findOne({ where: { id: productId } });

    const transaction = await Transaction.create();

    res.json({ message: "Create Transaction success", product });
  } catch (err) {
    next(err);
  }
};

// TODO
exports.deleteTransaction = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;

    const product = await Product.findOne({ where: { id: productId } });

    const transaction = await Transaction.create();

    res.json({ message: "Create Transaction success", product });
  } catch (err) {
    next(err);
  }
};
