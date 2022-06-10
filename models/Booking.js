module.exports = (Sequelize, DataTypes) => {
  const Booking = Sequelize.define(
    "Booking",
    {
      status: DataTypes.ENUM("RESERVED", "CANCEL"),
    },
    { underScore: true }
  );

  // TODO ASSOCIATE
  Booking.associate = (models) => {
    // user  => 1.client 2.tattooist
    Booking.belongsTo(models.User, {
      foreignKey: {
        name: "clientId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    // Booking.belongsTo(models.User, {
    //   foreignKey: {
    //     name: "tattooistId",
    //     allowNull: false,
    //   },
    //   onUpdate: "RESTRICT",
    //   onDelete: "RESTRICT",
    // });

    // transaction
    Booking.belongsTo(models.Transaction, {
      foreignKey: {
        name: "transactionId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return Booking;
};
