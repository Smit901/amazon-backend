module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_date: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending'
    },
    total_price: {
      type: DataTypes.FLOAT
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'credit-card'
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ShippingAddressId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  })

  Order.associate = (models) => {
    Order.belongsTo(models.User)
    Order.belongsTo(models.ShippingAddress)
    Order.belongsToMany(models.Product, {
      through: {
        model: models.OrderItem
      }
    })
  }

  return Order
}
