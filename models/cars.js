'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cars extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cars.init({
    nama_mobil: DataTypes.STRING,
    harga_perhari: DataTypes.FLOAT,
    ukuran: DataTypes.STRING,
    gambar: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Cars',
  });
  return Cars;
};