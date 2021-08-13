module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    eventName: DataTypes.STRING,
    addedBy: DataTypes.STRING,
    date: DataTypes.STRING,
    description: DataTypes.STRING,
  });

  Event.associate = models => {
    Event.belongsTo(models.User, {
      as: 'users',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Event.hasMany(models.Guest, {
      foreignKey: 'eventId',
      as: 'guests',
    });
  };

  return Event;
};
