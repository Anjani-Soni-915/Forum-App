import { Topic } from "../../models/topics.model";
import { CreateTopicInput, UpdateTopicInput } from "./topic.interface";

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
      const data = await Topic.findOne({ where: { id: id, status: true } });
      if (!data) {
        throw new Error("data not found");
      }
      return data;
    } catch (error: any) {
      console.error("Error in getdataById:", error.message);
      throw new Error(error.message);
    }
  },

  getTopics: async () => {
    try {
      const datas = await Topic.findAll({ where: { status: true } });
      if (datas.length === 0) {
        throw new Error("No data found");
      }
      return datas;
    } catch (error: any) {
      console.error("Error in getAlldata:", error.message);
      throw new Error(error.message);
    }
  },
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
