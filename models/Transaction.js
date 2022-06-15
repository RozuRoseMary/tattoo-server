module.exports = (Sequelize, DataTypes) => {
  const Transaction = Sequelize.define(
    "Transaction",
    {
      status: {
        type: DataTypes.ENUM("PENDING", "PAID", "CANCEL"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      payment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Proof of payment is required",
          },
        },
      },
    },
    { underScore: true }
  );

  // TODO ASSOCIATE
  Transaction.associate = (models) => {
    // * product
    Transaction.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    // * transaction
    Transaction.belongsTo(models.User, {
      foreignKey: {
        name: "clientId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    Transaction.belongsTo(models.User, {
      foreignKey: {
        name: "sellerId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    Transaction.hasOne(models.Booking, {
      foreignKey: {
        name: "transactionId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return Transaction;
};
