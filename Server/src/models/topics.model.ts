import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Subscription } from "./subscription.model";
import { TopicLikes } from "./topicLikes.model";
interface TopicAttributes {
  id: number;
  title: string;
  description: string;
  userId: number;
  likes: number;
  views: number;
  repliesCount: number;
  tags: object;
  feedType: "post" | "feedback" | "poll";
  isAnonymous: boolean;
  status?: boolean;
}

interface TopicCreationAttributes
  extends Optional<TopicAttributes, "id" | "status"> {}

// Extend the Sequelize Model
export class Topic
  extends Model<TopicAttributes, TopicCreationAttributes>
  implements TopicAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public userId!: number;
  public likes!: number;
  public views!: number;
  public repliesCount!: number;
  public tags!: object;
  public feedType!: "post" | "feedback" | "poll";
  public isAnonymous!: boolean;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  Topic.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      repliesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: JSON.stringify([]),
      },
      feedType: {
        type: DataTypes.ENUM("post", "feedback", "poll"),
        allowNull: false,
        defaultValue: "post",
      },

      isAnonymous: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Topic",
      tableName: "topics",
      timestamps: true,
    }
  );

  Topic.associate = function (models: any) {
    Topic.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
      onDelete: "CASCADE",
    });
    Topic.hasMany(models.Subscription, {
      foreignKey: "topicId",
      as: "subscriptionData",
      onDelete: "CASCADE",
    });
    Topic.hasMany(models.Reply, {
      foreignKey: "topicId",
      as: "replyData",
      onDelete: "CASCADE",
    });
    Topic.hasMany(models.TopicLikes, {
      foreignKey: "topicId",
      as: "topicLikesData",
      onDelete: "CASCADE",
    });
    Topic.hasMany(models.NotificationInfo, {
      foreignKey: "topicId",
      as: "topicData",
      onDelete: "SET NULL",
    });
    Topic.hasMany(models.PollVote, {
      foreignKey: "topicId",
      as: "pollVoteData",
      onDelete: "SET NULL",
    });

    Topic.hasMany(models.Poll, {
      foreignKey: "topicId",
      as: "pollData",
      onDelete: "SET NULL",
    });
  };

  //   const forceSync = false;

  //   sequelize.sync({ force: forceSync }).then(() => {
  //     if (forceSync) {
  //       console.log("🔖~ Topics table created!");
  //     }
  //   });

  return Topic;
};
