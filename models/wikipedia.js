/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('wikipedia', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: 'LONGBLOB',
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'wikipedia'
  });
};
