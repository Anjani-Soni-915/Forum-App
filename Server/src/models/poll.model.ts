import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface PollAttributes {
  id: number;
  topicId: number;
  isMultipleChoice: boolean;
  expiresAt?: Date | null;
}

interface PollCreationAttributes extends Optional<PollAttributes, "id"> {}

export class Poll
  extends Model<PollAttributes, PollCreationAttributes>
  implements PollAttributes
{
  public id!: number;
  public topicId!: number;
  public isMultipleChoice!: boolean;
  public expiresAt!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  Poll.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      topicId: { type: DataTypes.INTEGER, allowNull: false },
      isMultipleChoice: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expiresAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "Poll",
      tableName: "polls",
      timestamps: true,
    }
  );

  Poll.associate = function (models: any) {
    Poll.belongsTo(models.Topic, {
      foreignKey: "topicId",
      as: "topicData",
      onDelete: "CASCADE",
    });
    Poll.hasMany(models.PollOption, {
      foreignKey: "pollId",
      as: "options",
      onDelete: "CASCADE",
    });
  };

  return Poll;
};
