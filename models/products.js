module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    price: { type: DataTypes.FLOAT },
    stock: { type: DataTypes.INTEGER },
    ratings: { type: DataTypes.INTEGER },
    image: { type: DataTypes.STRING },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      define: new Date()
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      define: new Date()
    }
  })
  Product.associate = (models) => {
    Product.belongsToMany(models.Cart, {
      through: {
        model: models.CartItem
      }
    })
  }
  return Product
}
