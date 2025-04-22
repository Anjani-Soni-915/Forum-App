import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface NotificationInfoAttributes {
  id: number;
  topicId?: number | null;
  replyId?: number | null;
  subscribedId?: number | null;
  actionTypeId: number;
  receiverId: number;
  notificationRecordId: number;
  isRead?: boolean;
  status?: boolean;
}

interface NotificationInfoCreationAttributes
  extends Optional<NotificationInfoAttributes, "id"> {}

export class NotificationInfo
  extends Model<NotificationInfoAttributes, NotificationInfoCreationAttributes>
  implements NotificationInfoAttributes
{
  public id!: number;
  public topicId!: number | null;
  public replyId!: number | null;
  public subscribedId!: number | null;
  public actionTypeId!: number;
  public receiverId!: number;
  public notificationRecordId!: number;
  public isRead!: boolean;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    NotificationInfo.belongsTo(models.Topic, {
      foreignKey: "topicId",
      as: "topicData",
      onDelete: "SET NULL",
    });
    NotificationInfo.belongsTo(models.Reply, {
      foreignKey: "replyId",
      as: "replyData",
      onDelete: "SET NULL",
    });
    NotificationInfo.belongsTo(models.Subscription, {
      foreignKey: "subscribedId",
      as: "subscriptionData",
      onDelete: "SET NULL",
    });
    NotificationInfo.belongsTo(models.NotificationType, {
      foreignKey: "actionTypeId",
      as: "actionType",
      onDelete: "CASCADE",
    });
    NotificationInfo.belongsTo(models.User, {
      foreignKey: "receiverId",
      as: "receiver",
      onDelete: "CASCADE",
    });
    NotificationInfo.belongsTo(models.NotificationRecords, {
      foreignKey: "notificationRecordId",
      as: "notificationRecords",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  NotificationInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      replyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      subscribedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      actionTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notificationRecordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "NotificationInfo",
      tableName: "notification_info",
      timestamps: true,
    }
  );

  // to add new columns
  // sequelize.sync({ alter: true });

  return NotificationInfo;
};
