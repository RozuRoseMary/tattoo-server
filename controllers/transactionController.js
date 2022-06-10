const { Product, Transaction } = require("../models");

exports.createTransaction = async (req, res, next) => {
  try {
    const { productId: id } = req.params;
    const { status, clientId } = req.body;

    const product = await Product.findOne({ where: { id } });

    const transaction = await Transaction.create({
      productId: product.id,
      status,
    });

    res.json({ message: "Create Transaction success", product });
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
