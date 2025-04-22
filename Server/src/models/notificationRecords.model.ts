import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface NotificationRecordsAttributes {
  id: number;
  senderId: number;
  isRead: boolean;
  content: string;
  status?: boolean;
}

interface NotificationRecordsCreationAttributes
  extends Optional<NotificationRecordsAttributes, "id"> {}

export class NotificationRecords
  extends Model<
    NotificationRecordsAttributes,
    NotificationRecordsCreationAttributes
  >
  implements NotificationRecordsAttributes
{
  public id!: number;
  public senderId!: number;
  public isRead!: boolean;
  public content!: string;
  public status!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    NotificationRecords.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender",
      onDelete: "CASCADE",
    });
    NotificationRecords.hasMany(models.NotificationInfo, {
      foreignKey: "notificationRecordId",
      as: "notificationRecords",
      onDelete: "CASCADE",
    });
  }
}

export default (sequelize: Sequelize) => {
  NotificationRecords.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: "NotificationRecords",
      tableName: "notification_records",
      timestamps: true,
    }
  );

  return NotificationRecords;
};
