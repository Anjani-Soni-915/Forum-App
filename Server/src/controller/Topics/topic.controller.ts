import { Reply } from "../../models/reply.model";
import { ReplyLikes } from "../../models/replyLikes.model";
import { Subscription } from "../../models/subscription.model";
import { TopicLikes } from "../../models/topicLikes.model";
import { Topic } from "../../models/topics.model";
import { User } from "../../models/user.model";
import { CreateTopicInput, UpdateTopicInput } from "./topic.interface";
import { number } from "joi";

const topicController = {
  createTopic: async (userId: number, input: CreateTopicInput) => {
    try {
      if (!userId) {
        throw new Error("Authentication required");
      }

      const topic = await Topic.create({
        ...input,
        userId,
      });

      return {
        message: "Topic created successfully",
        topic,
      };
    } catch (error: any) {
      console.error("Error in createTopic:", error.message);
      throw new Error(error.message || "Failed to create topic");
    }
  },

  getTopicById: async (id: number) => {
    try {
      const data = await Topic.findOne({
        where: { id: id, status: true },
        include: [
          { model: User, as: "userData" },
          {
            model: Reply,
            as: "replyData",
            include: [
              {
                model: User,
                as: "userData",
              },
              {
                model: ReplyLikes,
                as: "replyLikesData",
              },
            ],

            separate: true,
            order: [["createdAt", "DESC"]],
          },
          { model: TopicLikes, as: "topicLikesData" },
          { model: Subscription, as: "subscriptionData" },
        ],
      });

      if (!data) {
        throw new Error("data not found");
      }

      return data;
    } catch (error: any) {
      console.error("Error in getdataById:", error.message);
      throw new Error(error.message);
    }
  },

  getTopics: async (page: number = 1, pageSize: number = 10) => {
    try {
      const validPage = page > 0 ? page : 1;
      const validPageSize = pageSize > 0 ? pageSize : 10;
      const offset = (validPage - 1) * validPageSize;

      console.log(
        `Fetching topics - Page: ${validPage}, PageSize: ${validPageSize}`
      );

      const { count, rows } = await Topic.findAndCountAll({
        where: { status: true },
        distinct: true,
        include: [
          { model: User, as: "userData" },
          { model: Reply, as: "replyData" },
          { model: TopicLikes, as: "topicLikesData" },
          { model: Subscription, as: "subscriptionData" },
        ],
        order: [["createdAt", "DESC"]],
        limit: validPageSize,
        offset: offset,
      });

      console.log(`Total Topics: ${count}, Fetched: ${rows.length}`);

      return {
        totalItems: count,
        totalPages: Math.ceil(count / validPageSize),
        currentPage: validPage,
        topics: rows,
      };
    } catch (error: any) {
      console.error("Error in getTopics:", error.message);
      throw new Error(error.message || "Failed to fetch topics");
    }
  },

  // getTopics: async () => {
  //   try {
  //     const datas = await Topic.findAll({
  //       where: { status: true },
  //       include: [
  //         { model: User, as: "userData" },
  //         { model: Reply, as: "replyData" },
  //         { model: TopicLikes, as: "topicLikesData" },
  //         {
  //           model: Subscription,
  //           as: "subscriptionData",
  //         },
  //       ],
  //       order: [["createdAt", "DESC"]],
  //     });
  //     if (datas.length === 0) {
  //       throw new Error("No data found");
  //     }
  //     return datas;
  //   } catch (error: any) {
  //     console.error("Error in getAlldata:", error.message);
  //     throw new Error(error.message);
  //   }
  // },
  updateTopic: async (id: number, input: UpdateTopicInput) => {
    try {
      const data = await Topic.findByPk(id);
      if (!data) {
        throw new Error("data not found");
      }

      const updatedData = await data.update(input);

      return {
        message: "data updated successfully",
        topic: updatedData,
      };
    } catch (error: any) {
      console.error("Error in updatedata:", error.message);
      throw new Error(error.message);
    }
  },
  deleteTopic: async (id: number) => {
    try {
      const data = await Topic.findOne({
        where: { id, status: true },
      });
      if (!data) {
        throw new Error("Data not found");
      }

      await data.update({ status: false });

      return "Data deleted successfully";
    } catch (error: any) {
      console.error("Error in deleteTopic:", error.message);
      throw new Error(error.message);
    }
  },
};
export default topicController;
