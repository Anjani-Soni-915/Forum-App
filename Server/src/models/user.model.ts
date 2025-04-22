import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Subscription } from "./subscription.model";
import { TopicLikes } from "./topicLikes.model";
import { ReplyLikes } from "./replyLikes.model";

interface UserAttributes {
  id: number;
  fName: string;
  lName: string;
  email: string;
  password: string;
  status?: boolean;
  image?: string;
  dob?: string;
  profession?: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "status"> {}

// Extend the Sequelize Model
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public fName!: string;
  public lName!: string;
  public email!: string;
  public image!: string;
  public dob!: string;
  public profession!: string;
  public password!: string;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "email_unique",
      },

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dob: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profession: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );

  User.associate = function (models: any) {
    User.hasMany(models.Topic, {
      foreignKey: "userId",
      as: "topicData", // Add alias
      onDelete: "CASCADE",
    });

    User.hasMany(models.Reply, {
      foreignKey: "userId",
      as: "replyData",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Subscription, {
      foreignKey: "userId",
      as: "subscriptionData",
      onDelete: "CASCADE",
    });
    User.hasMany(models.TopicLikes, {
      foreignKey: "userId",
      as: "topicLikesData",
      onDelete: "CASCADE",
    });
    User.hasMany(models.ReplyLikes, {
      foreignKey: "userId",
      as: "replyLikesData",
      onDelete: "CASCADE",
    });
    User.hasMany(models.NotificationInfo, {
      foreignKey: "receiverId",
      as: "receiver",
      onDelete: "CASCADE",
    });
    User.hasMany(models.NotificationRecords, {
      foreignKey: "senderId",
      as: "sender",
      onDelete: "CASCADE",
    });
  };

  // Sync database with force true (Warning: This will drop and recreate the table on every restart)
  // const forceSync = true;

  // sequelize.sync({ force: forceSync }).then(() => {
  //   if (forceSync) {
  //     console.log("🔖~ User table created!");
  //   }
  // });

  return User;
};
