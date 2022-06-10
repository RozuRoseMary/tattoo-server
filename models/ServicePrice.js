module.exports = (Sequelize, DataTypes) => {
  const ServicePrice = Sequelize.define(
    "ServicePrice",
    {
      servicePrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Service price is required",
          },
        },
      },
      minWidth: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Min width of tattoo is required",
          },
        },
      },
      maxWidth: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      minHeight: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Min height of tattoo is required",
          },
        },
      },
      maxHeight: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      color: {
        type: DataTypes.ENUM("BW", "Colors"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["BW", "Colors"]],
            msg: "Color must be 'BW' or 'Colors'",
          },
          notEmpty: {
            msg: "Color is required",
          },
        },
      },
    },
    { underScore: true }
  );

  // * ASSOCIATE
  ServicePrice.associate = (models) => {
    ServicePrice.belongsTo(models.ServicePrice, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return ServicePrice;
};
