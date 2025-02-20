import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { Topic } from "./topics.model";

interface SubscriptionAttributes {
  id: number;
  userId: number;
  topicId: number;
  status?: boolean;
}

interface SubscriptionCreationAttributes
  extends Optional<SubscriptionAttributes, "id"> {}

export class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: number;
  public userId!: number;
  public topicId!: number;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {}
}

export default (sequelize: Sequelize) => {
  Subscription.init(
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
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Subscription",
      tableName: "subscriptions",
      timestamps: true,
    }
  );
  Subscription.associate = function (models: any) {
    Subscription.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userData",
      onDelete: "CASCADE",
    });
    Subscription.belongsTo(models.Topic, {
      foreignKey: "topicId",
      as: "topicData",
      onDelete: "CASCADE",
    });
  };

  //   sequelize.sync({ force: true }).then(() => {
  //     console.log("Subscriptions table created!");
  //   });

  return Subscription;
};
