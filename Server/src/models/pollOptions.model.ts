import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface PollOptionAttributes {
  id: number;
  pollId: number;
  optionText: string;
  voteCount: number;
}

interface PollOptionCreationAttributes
  extends Optional<PollOptionAttributes, "id" | "voteCount"> {}

export class PollOption
  extends Model<PollOptionAttributes, PollOptionCreationAttributes>
  implements PollOptionAttributes
{
  public id!: number;
  public pollId!: number;
  public optionText!: string;
  public voteCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  PollOption.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      pollId: { type: DataTypes.INTEGER, allowNull: false },
      optionText: { type: DataTypes.STRING, allowNull: false },
      voteCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "PollOption",
      tableName: "poll_options",
      timestamps: true,
    }
  );

  PollOption.associate = function (models: any) {
    PollOption.belongsTo(models.Poll, {
      foreignKey: "pollId",
      as: "pollData",
      onDelete: "CASCADE",
    });
    PollOption.hasMany(models.PollVote, {
      foreignKey: "pollOptionId",
      as: "votes",
      onDelete: "CASCADE",
    });
  };

  return PollOption;
};
