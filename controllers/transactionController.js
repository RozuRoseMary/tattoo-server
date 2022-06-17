const { User, Product, Transaction, Booking } = require("../models");
const { Op } = require("sequelize");

const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");

exports.getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: { id },
      include: [
        {
          model: Product,
          include: [
            {
              model: User,
              as: "Tattooist",
              attributes: { exclude: ["password"] },
            },
            {
              model: User,
              as: "Tattooer",
              attributes: { exclude: ["password"] },
            },
          ],
        },
      ],
    });

    if (!transaction) {
      createError("Can not found this transaction id");
    }

    res.json({ transaction });
  } catch (err) {
    next(err);
  }
};

exports.getMyTransactionReceived = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== +userId) {
      createError("You can not view other statement.");
    }

    const transactions = await Transaction.findAll({
      where: {
        sellerId: userId,
      },
      include: [
        {
          model: Product,
        },
        {
          model: User,
          as: "ClientTransaction",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    if (!transactions) {
      createError("Can not found your transaction .");
    }

    res.json({ transactions });
  } catch (err) {
    next(err);
  }
};

exports.getMyTransactionPaid = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== +userId) {
      createError("You can not view other statement.");
    }

    const transactions = await Transaction.findAll({
      where: {
        clientId: userId,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: User,
              as: "Tattooist",
              attributes: { exclude: ["password"] },
            },
            {
              model: User,
              as: "Tattooer",
              attributes: { exclude: ["password"] },
            },
          ],
        },
      ],
    });

    if (!transactions) {
      createError("Can not found your transaction .");
    }

    res.json({ transactions });
  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { productId: id } = req.params;
    const { canBook } = req.params;

    // * PRODUCT
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      createError("Can not found this product", 400);
    }

    // *SELLER
    let sellerId;
    if (product.tattooerId) {
      sellerId = product.tattooerId;
    } else if (product.tattooistId) {
      sellerId = product.tattooistId;
    }

    if (req.user.id === sellerId) {
      createError("You cannot buy your product");
    }

    let payment;
    if (req.file) {
      const res = await cloudinary.upload(req.file.path);
      payment = res.secure_url;
    }

    if (!payment) {
      createError("Payment picture is required", 400);
    }

    const transaction = await Transaction.create({
      productId: product.id,
      clientId: req.user.id,
      sellerId,
      payment,
      canBook,
    });

    if (!transaction) {
      createError("Can not checkout this product", 400);
    }

    // * PRODUCT AVAILABLE
    if (product.status === "AVAILABLE") {
      product.status = "PENDING";
      await product.save();
    } else {
      createError("This product not available.");
    }

    res.json({ message: "Create Transaction success", transaction });
  } catch (err) {
    next(err);
  }
};

// TODO
exports.updateTransaction = async (req, res, next) => {
  try {
    const { status, productId, transactionId } = req.body;

    // * PRODUCT status SOLD_OUT
    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      createError("Cannot find this product");
    }

    // * UPDATE TRANSACTION
    const transaction = await Transaction.findOne({
      where: { id: transactionId, productId: product.id },
      include: [{ model: Product }],
    });

    if (!transaction) {
      createError("Can not find this transaction", 400);
    }

    if (transaction.status === status) {
      createError("You can not update status equal to current status", 400);
    }

    transaction.status = status;
    transaction.save();
    if (transaction.status === "CANCEL") {
      product.status = "AVAILABLE";
      product.save();
      createError("Transaction was cancel by user.", 400);
    } else if (transaction.status === "PAID") {
      product.status = "SOLD_OUT";
      product.save();
    }

    res.json({ message: "Create Transaction success", transaction });
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
