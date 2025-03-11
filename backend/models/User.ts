import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  riotId?: string;
  usernameId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export default (sequelize: Sequelize) => {
  class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id!: number;
    username!: string;
    email!: string;
    passwordHash!: string;
    riotId?: string;
    usernameId!: string;
    
    static associate(models: any) {
      // Define associations here if needed
    }
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    riotId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usernameId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true 
  });
  
  return User;
};