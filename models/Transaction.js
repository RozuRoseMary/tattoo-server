module.exports = (Sequelize, DataTypes) => {
  const Transaction = Sequelize.define(
    "Transaction",
    {
      status: {
        type: DataTypes.ENUM("PADDING", "PAID"),
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
