import UserController from "../../controller/User/user.controller";
import {
  CreateUserInput,
  UpdateUserInput,
  LoginInput,
} from "../../controller/User/user.interface";

export default {
  Query: {
    getUserById: async (_: any, { id }: { id: number }) => {
      try {
        return await UserController.getUserById(id);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error fetching user by ID: ${error.message}`);
      }
    },
    getUser: async () => {
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
        throw new Error(`Error creating user: ${error.message}`);
      }
    },

    updateUser: async (
      _: any,
      { id, input }: { id: number; input: UpdateUserInput }
    ) => {
      try {
        return await UserController.updateUser(id, input);
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error updating user: ${error.message}`);
      }
    },
    deleteUser: async (_: any, { id }: { id: number }) => {
      try {
        return await UserController.deleteUser(id);
      } catch (error: any) {
        console.error(error); // log the actual error
        throw new Error(`Error deleting user: ${error.message}`);
      }
    },
  },
};
