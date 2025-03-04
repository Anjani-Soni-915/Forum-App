import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface NotificationTypeAttributes {
  id: number;
  action: string;
  content: string;
  status?: boolean;
}

interface NotificationTypeCreationAttributes
  extends Optional<NotificationTypeAttributes, "id"> {}

export class NotificationType
  extends Model<NotificationTypeAttributes, NotificationTypeCreationAttributes>
  implements NotificationTypeAttributes
{
  public id!: number;
  public action!: string;
  public content!: string;
  public status: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static associate(models: any) {
    NotificationType.hasMany(models.NotificationInfo, {
      foreignKey: "actionTypeId",
      as: "notifications",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  NotificationType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "action",
      },
      content: {
        type: DataTypes.STRING,
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
      modelName: "NotificationType",
      tableName: "notification_type",
      timestamps: true,
    }
  );

  return NotificationType;
};
