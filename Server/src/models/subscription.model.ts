import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface SubscriptionAttributes {
  id: number;
  userId: number;
  topicId: number;
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
    },
    {
      sequelize,
      modelName: "Subscription",
      tableName: "subscriptions",
      timestamps: true,
    }
  );
  //   const forceSync = false;

  //   sequelize.sync({ force: forceSync }).then(() => {
  //     if (forceSync) {
  //       console.log("🔖~ Subscription table created!");
  //     }
  //   });

  return Subscription;
};
