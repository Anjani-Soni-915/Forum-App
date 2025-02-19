import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ReplyAttributes {
  id: number;
  userId: number;
  topicId: number;
  text: string;
  likes?: number;
  status?: boolean;
}

interface ReplyCreationAttributes extends Optional<ReplyAttributes, "id"> {}

export class Reply
  extends Model<ReplyAttributes, ReplyCreationAttributes>
  implements ReplyAttributes
{
  public id!: number;
  public userId!: number;
  public topicId!: number;
  public text!: string;
  public likes!: number;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  Reply.init(
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
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Reply",
      tableName: "replies",
      timestamps: true,
    }
  );

  //   sequelize.sync({ force: true }).then(() => {
  //     console.log("reply table created!");
  //   });
  return Reply;
};
