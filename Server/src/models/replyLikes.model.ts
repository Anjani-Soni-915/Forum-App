import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ReplyLikesAttributes {
  id: number;
  replyId: number;
  userId: number;
  status?: boolean;
}

interface ReplyLikesCreationAttributes
  extends Optional<ReplyLikesAttributes, "id"> {}

export class ReplyLikes
  extends Model<ReplyLikesAttributes, ReplyLikesCreationAttributes>
  implements ReplyLikesAttributes
{
  public id!: number;
  public replyId!: number;
  public userId!: number;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  ReplyLikes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      replyId: {
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
      modelName: "ReplyLikes",
      tableName: "replylikes",
      timestamps: true,
    }
  );

  ReplyLikes.associate = function (models: any) {
    ReplyLikes.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
      onDelete: "CASCADE",
    });
    ReplyLikes.belongsTo(models.Reply, {
      foreignKey: "replyId",
      as: "replyData",
      onDelete: "CASCADE",
    });
  };

  return ReplyLikes;
};
