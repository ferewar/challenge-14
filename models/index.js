const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Post, { foreignKey: 'userId' });
db.Post.belongsTo(db.User, { foreignKey: 'userId' });


db.Comment.belongsTo(db.User, {
  foreignKey: 'userId', 
  onDelete: 'CASCADE'
});

db.Post.hasMany(db.Comment, {
  foreignKey: 'postId'
});

module.exports = db;
