module.exports = (sequelize, DataTypes) => {
  const Adminlog = sequelize.define('Adminlog', {
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  })
  return Adminlog
}
