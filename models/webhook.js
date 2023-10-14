module.exports = (sequelize, DataTypes) => {
  const Webhook = sequelize.define('Webhook', {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action_description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  return Webhook
}
