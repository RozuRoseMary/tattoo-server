const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middlewares/upload");
const { User, Product, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "Tattooist",
          attributes: { exclude: ["password"] },
        },
        { model: User, as: "Tattooer", attributes: { exclude: ["password"] } },
      ],
    });
    res.json({ products }); //return [{1,2,...}]
  } catch (err) {
    next(err);
  }
};

exports.getAllProductAvailable = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { status: "AVAILABLE" },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "Tattooist",
          attributes: { exclude: ["password"] },
        },
        { model: User, as: "Tattooer", attributes: { exclude: ["password"] } },
      ],
    });
    res.json({ products }); //return [{1,2,...}]
  } catch (err) {
    next(err);
  }
};

exports.getProductByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const products = await Product.findAll({
      where: {
        [Op.or]: [{ tattooistId: userId }, { tattooerId: userId }],
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "Tattooist",
          attributes: { exclude: ["password"] },
        },
        { model: User, as: "Tattooer", attributes: { exclude: ["password"] } },
      ],
    });

    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      where: {
        id: productId,
      },
      include: [
        {
          model: User,
          as: "Tattooist",
          attributes: { exclude: ["password"] },
        },
        { model: User, as: "Tattooer", attributes: { exclude: ["password"] } },
      ],
    });

    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const {
      title,
      price,
      description,
      servicePrice,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      color,
    } = req.body;

    if (req.user.role === "CLIENT") {
      createError("You not have permission to create product", 403);
    }

    let image;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      image = result.secure_url;
    }

    const isTattooist = req.user.role === "TATTOOIST";
    const isTattooer = req.user.role === "TATTOOER";

    const product = await Product.create({
      tattooistId: isTattooist ? req.user.id : null,
      tattooerId: isTattooer ? req.user.id : null,
      title,
      image,
      price,
      description,
    });

    res.json({ message: "Create Product Success", product });
  } catch (err) {
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, price, description } = req.body;

    if (!req.file && !title && !price && !description) {
      createError(
        "Require some of data (title, image, price, description) to update profile",
        400
      );
    }

    const product = await Product.findOne({ where: { id } });

    if (!product) {
      createError("Can not find product.", 400);
    }

    const isTattooist = req.user.role === "TATTOOIST";
    const isTattooer = req.user.role === "TATTOOER";
    if (!isTattooist) {
      if (!isTattooer) {
        createError("You have no permission", 403);
      }
    }

    if (req.user.id !== product.tattooistId) {
      if (req.user.id !== product.tattooerId) {
        createError("You have no permission to update other product", 403);
      }
    }

    if (req.file) {
      const res = await cloudinary.upload(req.file.path);
      if (product.image) {
        const splitted = product.image.split("/");
        const publicId = splitted[splitted.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      product.image = res.secure_url;
    }

    if (title) {
      product.title = title;
    }

    if (price) {
      product.price = price;
    }

    if (description) {
      product.description = description;
    }

    await product.save();

    res.json({ where: "Update product success", product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      createError("Product not found", 400);
    }

    if (product.image) {
      const splitted = product.image.split("/");
      const publicId = splitted[splitted.length - 1].split(".")[0];
      await cloudinary.destroy(publicId);
    }

    await Product.destroy({ where: { id } }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
