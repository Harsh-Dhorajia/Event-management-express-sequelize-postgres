module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowEmpty: false,
      allowNull: false,
      isUnique: true,
    },
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.STRING,
  });

  User.associate = models => {
    User.hasMany(models.Event, {
      foreignKey: 'userId',
      as: 'events',
    });
    User.hasMany(models.Guest, {
      foreignKey: 'userId',
      as: 'guests',
    });
  };

  return User;
};
