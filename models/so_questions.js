/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('so_questions', {
    tags: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_answered: {
      type: DataTypes.STRING,
      allowNull: true
    },
    view_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    answer_count: {
      type: DataTypes.INTEGER(11),
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
    question_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    body: {
      type: 'LONGBLOB',
      allowNull: true
    },
    has_more: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quota_max: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    quota_remaining: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
    tableName: 'so_questions'
  });
};
