module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "First name must not be empty",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Last name must not be empty",
          },
        },
      },
      displayName: {
        type: DataTypes.STRING,
      },
      aboutMe: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Phone number must not be empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Username must not be empty",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password must not be empty",
          },
        },
      },
      role: {
        type: DataTypes.ENUM("CLIENT", "TATTOOIST", "TATTOOER"),
        allowNull: false,
        validate: {
          isIn: {
            args: [["Client", "Tattooist", "Tattooer"]],
            msg: "Role is not correct, You must choose role from one of this => 'Client', 'Tattooist', 'Tattooer'",
          },
          notEmpty: {
            msg: "Role must not be empty",
          },
        },
      },
      profilePicture: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Picture must not be empty",
          },
        },
      },
      storeDirection: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Display name must not be empty",
          },
        },
      },
    },
    { underScore: true }
  );

  // * ASSOCIATE
  User.associate = (models) => {
    // product
    User.hasMany(models.Product, {
      as: "Tattooist",
      foreignKey: {
        name: "tattooistId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Product, {
      as: "Tattooer",
      foreignKey: {
        name: "tattooerId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    // transaction
    User.hasMany(models.Transaction, {
      as: "ClientTransaction",
      foreignKey: {
        name: "clientId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Transaction, {
      as: "SellerTransaction",
      foreignKey: {
        name: "sellerId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    // booking 1.client 2.tattooist
    User.hasMany(models.Booking, {
      as: "ClientBooking",
      foreignKey: {
        name: "clientId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    User.hasMany(models.Payment, {
      foreignKey: {
        name: "userId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    // User.hasMany(models.Booking, {
    //   as: "Tattooist",
    //   foreignKey: {
    //     name: "tattooistId",
    //     allowNull: false,
    //   },
    //   onUpdate: "RESTRICT",
    //   onDelete: "RESTRICT",
    // });
  };
  return User;
};
