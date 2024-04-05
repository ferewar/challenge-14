const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {
    checkPassword(loginPw) {
      const isValid = bcrypt.compareSync(loginPw, this.password);
      return isValid;
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
      },
    },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false, 
    freezeTableName: true, 
    underscored: true, 
    tableName: 'users', 
    hooks: {
      beforeCreate: async (userData) => {
        // Only hash the password if it has not been hashed already
        if (!userData.password.startsWith('$2b$')) {
          console.log('Hashing password for user:', userData.username, 'with password:', userData.password);
          userData.password = await bcrypt.hash(userData.password, 10);
          console.log('Hashed password:', userData.password);
        }
        return userData;
      },
      beforeUpdate: async (userData) => {
        if (userData.changed('password') && !userData.password.startsWith('$2b$')) {
          userData.password = await bcrypt.hash(userData.password, 10);
        }
        return userData;
      },
    },
  });

  return User;
};