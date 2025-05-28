import dbConfig from "../config/db";
import { Sequelize, Dialect, Options, Model, ModelStatic } from "sequelize";
import userModel from "./user.model";
import topicModel from "./topics.model";
import replyModel from "./reply.model";
import subscriptionModel from "./subscription.model";
import topicLikesModel from "./topicLikes.model";
import replyLikesModel from "./replyLikes.model";
import notificationInfo from "./notificationInfo.model";
import notificationType from "./notificationType.model";
import notificationRecords from "./notificationRecords.model";
import poll from "./poll.model";
import pollOption from "./pollOptions.model";
import pollVote from "./pollVote.mode";

interface DbInterface {
  Sequelize: typeof Sequelize; //The Sequelize class itself, used to configure and interact with the database.
  sequelize: Sequelize; //An instance of the Sequelize class, representing the active connection to the database.
  User: ModelStatic<Model<any, any>>;
  Topic: ModelStatic<Model<any, any>>;
  Reply: ModelStatic<Model<any, any>>;
  Subscription: ModelStatic<Model<any, any>>;
  TopicLikes: ModelStatic<Model<any, any>>;
  ReplyLikes: ModelStatic<Model<any, any>>;
  NotificationInfo: ModelStatic<Model<any, any>>;
  NotificationType: ModelStatic<Model<any, any>>;
  NotificationRecords: ModelStatic<Model<any, any>>;
  Poll: ModelStatic<Model<any, any>>;
  PollOption: ModelStatic<Model<any, any>>;
  PollVote: ModelStatic<Model<any, any>>;
}

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect as Dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
} as Options);

const db: DbInterface = {
  Sequelize,
  sequelize,
  User: userModel(sequelize),
  Topic: topicModel(sequelize),
  Reply: replyModel(sequelize),
  Subscription: subscriptionModel(sequelize),
  TopicLikes: topicLikesModel(sequelize),
  ReplyLikes: replyLikesModel(sequelize),
  NotificationInfo: notificationInfo(sequelize),
  NotificationType: notificationType(sequelize),
  NotificationRecords: notificationRecords(sequelize),
  Poll: poll(sequelize),
  PollOption: pollOption(sequelize),
  PollVote: pollVote(sequelize),
};

// Initialize model associations
Object.keys(db).forEach((modelName) => {
  const model = db[modelName as keyof DbInterface] as any;
  if (model && model.associate) {
    model.associate(db);
  }
});

export default db;
