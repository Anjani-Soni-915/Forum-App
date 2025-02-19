import UserController from "../../controller/User/user.controller";
import {
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
} from "../../controller/User/user.interface";

export default {
  Query: {
    getUserById: async (_: any, __: any, context: any) => {
      if (!context) throw new Error("Unauthorized"); // Token required
      try {
        const userId = context.user.id;
        return await UserController.getUserById(userId);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error fetching user by ID: ${error.message}`);
      }
    },

    getUser: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized"); //token required
      try {
        return await UserController.getAllUser();
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error fetching all users: ${error.message}`);
      }
    },
  },

  Mutation: {
    createUser: async (_: any, { input }: { input: CreateUserInput }) => {
      try {
        return await UserController.createUser(input);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error creating user: ${error.message}`);
      }
    },

    login: async (_: any, { input }: { input: LoginInput }) => {
      try {
        return await UserController.login(input);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error logging in user: ${error.message}`);
      }
    },

    updateUser: async (
      _: any,
      { input }: { input: UpdateUserInput },
      context: any
    ) => {
      if (!context.user) throw new Error("Unauthorized"); // token required
      try {
        return await UserController.updateUser(context.user.id, input);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error updating user: ${error.message}`);
      }
    },

    deleteUser: async (_: any, { id }: { id: number }, context: any) => {
      if (!context.user) throw new Error("Unauthorized"); // token required
      try {
        return await UserController.deleteUser(id);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error deleting user: ${error.message}`);
      }
    },
  },
};
