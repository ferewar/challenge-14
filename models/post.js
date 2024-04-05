const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Post extends Model {}

  Post.init({
    // Model attributes
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', 
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Post', 
    tableName: 'posts', 
    freezeTableName: true, 
    underscored: false, 
  });

  return Post;
};
