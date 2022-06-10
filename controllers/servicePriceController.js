const createError = require("../utils/createError");
const { User, Product, ServicePrice, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.createServicePrice = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { servicePrice, minWidth, maxWidth, minHeight, maxHeight, color } =
      req.body;

    const product = await Product.findOne({ where: { id: productId } });

    if (product.tattooerId) {
      createError("Only tattooist can use this feature");
    }

    if (product.id !== +productId) {
      createError("Cannot found product", 400);
    }

    const service = await ServicePrice.create({
      servicePrice,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      color,
      productId: product.id,
    });

    res.json({
      message: "Create service price success",
      service,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateServicePrice = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { servicePrice, minWidth, maxWidth, minHeight, maxHeight, color } =
      req.body;

    const service = await ServicePrice.findOne({ where: { id: serviceId } });

    if (!service) {
      createError("Could not find this service price", 400);
    }

    if (
      // !(servicePrice && minWidth && maxWidth && minHeight && maxHeight && color)
      !servicePrice &&
      !minWidth &&
      !maxWidth &&
      !minHeight &&
      !maxHeight &&
      !color
    ) {
      createError("Can not update empty value", 400);
    }

    if (servicePrice) {
      service.servicePrice = servicePrice;
    }

    if (color) {
      service.color = color;
    }

    if (minWidth) {
      service.minWidth = minWidth;
    }

    if (maxWidth) {
      service.maxWidth = maxWidth;
    }

    if (minHeight) {
      service.minHeight = minHeight;
    }

    if (maxHeight) {
      service.maxHeight = maxHeight;
    }

    await service.save();

    res.json({ message: "Update service price success", service });
  } catch (err) {
    next(err);
  }
};

exports.deleteServicePrice = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const service = await ServicePrice.findOne({ where: { id: serviceId } });

    if (!service) {
      createError("Can not find this service price.", 400);
    }

    if (service.id !== +serviceId) {
      createError("Service price not match.", 400);
    }

    await service.destroy();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
