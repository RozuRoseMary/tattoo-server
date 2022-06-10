module.exports = (Sequelize, DataTypes) => {
  const Product = Sequelize.define(
    "Product",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title must not be empty",
          },
        },
      },

      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Image must not be empty",
          },
        },
      },

      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Price must not be empty",
          },
        },
      },

      description: {
        type: DataTypes.STRING,
      },

      like: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
    },
    { underScore: true }
  );

  // * ASSOCIATE
  Product.associate = (models) => {
    Product.belongsTo(models.User, {
      as: "Tattooist",
      foreignKey: {
        name: "tattooistId",
        allowNull: true,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    Product.belongsTo(models.User, {
      as: "Tattooer",
      foreignKey: {
        name: "tattooerId",
        allowNull: true,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    // transaction
    Product.hasOne(models.Transaction, {
      foreignKey: {
        name: "clientId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    Product.hasMany(models.ServicePrice, {
      foreignKey: {
        name: "productId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return Product;
};
