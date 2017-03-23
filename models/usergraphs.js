/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usergraphs', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    graph: {
      type: 'LONGBLOB',
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'usergraphs'
  });
};
