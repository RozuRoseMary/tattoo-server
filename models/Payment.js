module.exports = (Sequelize, DataTypes) => {
  const Payment = Sequelize.define(
    "Payment",
    {
      paymentPicture: {
        type: DataTypes.STRING,
      },
      paymentData: {
        type: DataTypes.STRING,
      },
    },
    { underScore: true }
  );

  // * ASSOCIATE
  Payment.associate = (models) => {
    Payment.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return Payment;
};
