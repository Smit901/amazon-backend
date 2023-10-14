'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        price: Sequelize.FLOAT,
        stock: Sequelize.INTEGER,
        image: Sequelize.STRING,
        ratings: Sequelize.INTEGER,
        createdAt: {
          type: Sequelize.DATE,
          default: new Date()
        },
        updatedAt: {
          type: Sequelize.DATE,
          default: new Date()
        }
      })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products')
  }
}
