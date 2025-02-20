import { User } from "../../models/user.model";
import { CreateUserInput, LoginInput, UpdateUserInput } from "./user.interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Topic } from "../../models/topics.model";
import { Model } from "sequelize";
import { Reply } from "../../models/reply.model";
import { Subscription } from "../../models/subscription.model";
import { TopicLikes } from "../../models/topicLikes.model";
import { ReplyLikes } from "../../models/replyLikes.model";

const UserController = {
  getUserById: async (userId: number) => {
    try {
      const user = await User.findOne({
        where: {
          id: userId,
          status: true,
        },
        include: [
          { model: Topic, as: "topicData" },
          { model: Reply, as: "replyData" },
          {
            model: Subscription,
            as: "subscriptionData",
          },
          { model: TopicLikes, as: "topicLikesData" },
          { model: ReplyLikes, as: "replyLikesData" },
        ],
      });

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
      console.error("Error in getUserById:", error.message);
      throw new Error(error.message);
    }
  },

  // Get all users
  getAllUser: async () => {
    try {
      const users = await User.findAll({
        where: { status: true },
        include: [
          { model: Topic, as: "topicData" },
          { model: Reply, as: "replyData" },
          {
            model: Subscription,
            as: "subscriptionData",
          },
          { model: TopicLikes, as: "topicLikesData" },
          { model: ReplyLikes, as: "replyLikesData" },
        ],
      });
      if (users.length === 0) {
        throw new Error("No users found");
      }
      return users;
    } catch (error: any) {
      console.error("Error in getAllUser:", error.message);
      throw new Error(error.message);
    }
  },

  // create User
  createUser: async (input: CreateUserInput) => {
    try {
      const existingUser = await User.findOne({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await User.create({
        ...input,
        password: hashedPassword,
      });

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "10h" }
      );

      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      return {
        message: "User created successfully",
        user,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error: any) {
      console.error("Error in createUser:", error.message);
      throw new Error(error.message);
    }
  },

  // Login
  login: async (input: LoginInput) => {
    try {
      const user = await User.findOne({ where: { email: input.email } });

      if (!user) {
        throw new Error("User not found");
      }

      const passwordMatch = await bcrypt.compare(input.password, user.password);

      if (!passwordMatch) {
        console.log("");
        throw new Error("Invalid credentials");
      }

      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "10h" }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      return {
        message: "Login successful",
        user,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw new Error(error.message);
    }
  },

  // update user
  updateUser: async (id: number, input: UpdateUserInput) => {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }

      const updatedUser = await user.update(input);

      return {
        message: "User updated successfully",
        user: updatedUser,
      };
    } catch (error: any) {
      console.error("Error in updateUser:", error.message);
      throw new Error(error.message);
    }
  },

  // Delete a user
  deleteUser: async (id: number) => {
    try {
      const user = await User.findOne({
        where: { id, status: true },
      });

      if (!user) {
        throw new Error("User not found or already deleted");
      }

      await user.update({ status: false });

      return "User  deleted successfully";
    } catch (error: any) {
      console.error("Error in deleteUser:", error.message);
      throw new Error(`Error deleting user: ${error.message}`);
    }
  },
};

export default UserController;
