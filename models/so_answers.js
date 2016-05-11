/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('so_answers', {
    is_accepted: {
      type: DataTypes.STRING,
      allowNull: true
    },
    score: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    last_activity_date: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    creation_date: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    answer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    question_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    body: {
      type: 'LONGBLOB',
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'so_answers'
  });
};
