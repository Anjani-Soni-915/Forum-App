import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface PollVoteAttributes {
  id: number;
  userId: number;
  pollOptionId: number;
  topicId: number;
}

interface PollVoteCreationAttributes
  extends Optional<PollVoteAttributes, "id"> {}

export class PollVote
  extends Model<PollVoteAttributes, PollVoteCreationAttributes>
  implements PollVoteAttributes
{
  public id!: number;
  public userId!: number;
  public pollOptionId!: number;
  public topicId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  PollVote.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      pollOptionId: { type: DataTypes.INTEGER, allowNull: false },
      topicId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "PollVote",
      tableName: "poll_votes",
      timestamps: true,
    }
  );

  PollVote.associate = function (models: any) {
    PollVote.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
      onDelete: "CASCADE",
    });
    PollVote.belongsTo(models.PollOption, {
      foreignKey: "pollOptionId",
      as: "option",
      onDelete: "CASCADE",
    });
    PollVote.belongsTo(models.Topic, {
      foreignKey: "topicId",
      as: "topicData",
      onDelete: "CASCADE",
    });
  };

  return PollVote;
};
