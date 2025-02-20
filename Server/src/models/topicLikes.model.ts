import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface TopicLikesAttributes {
  id: number;
  topicId: number;
  userId: number;
  status?: boolean;
}

interface TopicLikesCreationAttributes
  extends Optional<TopicLikesAttributes, "id"> {}

export class TopicLikes
  extends Model<TopicLikesAttributes, TopicLikesCreationAttributes>
  implements TopicLikesAttributes
{
  public id!: number;
  public topicId!: number;
  public userId!: number;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  TopicLikes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
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
      modelName: "TopicLikes",
      tableName: "topiclikes",
      timestamps: true,
    }
  );

  TopicLikes.associate = function (models: any) {
    TopicLikes.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
      onDelete: "CASCADE",
    });
    TopicLikes.belongsTo(models.Topic, {
      foreignKey: "topicId",
      as: "topicData",
      onDelete: "CASCADE",
    });
  };

  return TopicLikes;
};
