import prisma from "../../config/prisma";
import { User } from "@prisma/client";
import { BaseRepository } from "../../repositories/baseRepository";
import logger from "../../utils/logger";

export class UserService {
  private userRepository: BaseRepository<User>;

  constructor() {
    this.userRepository = new BaseRepository<User>(prisma.user);
  }

  async createUser(user: User, username: string): Promise<User> {
    try {
      return await prisma.user.create({
        data: {
          ...user,
          createdBy: username,
          updatedBy: username,
        },
      });
    } catch (error) {
      logger.error("Error creating user", error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    user: Partial<User>,
    username: string
  ): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          ...user,
          updatedBy: username,
        },
      });
    } catch (error) {
      logger.error(`Error updating user with id ${id}`, error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      logger.error(`Error deleting user with id ${id}`, error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      logger.error(`Error fetching user with id ${id}`, error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await prisma.user.findMany({
        include: {
          role: true,
        },
      });
    } catch (error) {
      logger.error("Error fetching all users", error);
      throw error;
    }
  }

  async getUsersWithFilters(filter: any): Promise<User[] | null> {
    try {
      return await this.userRepository.findWithFilters(filter);
    } catch (error) {
      logger.error("Error fetching users with filters", error);
      throw error;
    }
  }
}

export default UserService;
