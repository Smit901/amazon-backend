module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    }
  })

  Cart.associate = (models) => {
    Cart.belongsTo(models.User)
    Cart.belongsToMany(models.Product, {
      through: {
        model: models.CartItem
      }
    })
  }

  return Cart
}
