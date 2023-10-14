module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    quantity: {
      type: DataTypes.INTEGER
    }
  })
  return OrderItem
}
