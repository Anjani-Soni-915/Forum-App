import { Sequelize, DataTypes, Model, Optional } from "sequelize";
interface TopicAttributes {
  id: number;
  title: string;
  description: string;
  userId: number;
  likes: number;
  views: number;
  repliesCount: number;
  tags: object;
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

  //   const forceSync = false;

  //   sequelize.sync({ force: forceSync }).then(() => {
  //     if (forceSync) {
  //       console.log("🔖~ Topics table created!");
  //     }
  //   });

  return Topic;
};
