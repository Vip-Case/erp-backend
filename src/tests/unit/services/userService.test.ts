import { describe, test, expect, mock, beforeEach, afterEach } from "bun:test";
import { UserService } from "../../../services/concrete/userService";

// Prisma modülünü mockla
mock.module("../../../config/prisma", () => {
  return {
    default: {
      user: {
        create: mock(() =>
          Promise.resolve({
            id: "1",
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            createdBy: "admin",
            updatedBy: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ),
        update: mock(() =>
          Promise.resolve({
            id: "1",
            username: "testuser",
            email: "test@example.com",
            firstName: "Updated",
            lastName: "User",
            createdBy: "admin",
            updatedBy: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ),
        findUnique: mock(() =>
          Promise.resolve({
            id: "1",
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            createdBy: "admin",
            updatedBy: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        ),
        findMany: mock(() =>
          Promise.resolve([
            {
              id: "1",
              username: "testuser",
              email: "test@example.com",
              firstName: "Test",
              lastName: "User",
              createdBy: "admin",
              updatedBy: "admin",
              createdAt: new Date(),
              updatedAt: new Date(),
              role: [],
            },
            {
              id: "2",
              username: "testuser2",
              email: "test2@example.com",
              firstName: "Test2",
              lastName: "User2",
              createdBy: "admin",
              updatedBy: "admin",
              createdAt: new Date(),
              updatedAt: new Date(),
              role: [],
            },
          ])
        ),
        delete: mock(() => Promise.resolve(true)),
      },
    },
  };
});

// BaseRepository mocklaması için
mock.module("../../../repositories/baseRepository", () => {
  return {
    BaseRepository: class {
      constructor() {}
      findById = mock(() =>
        Promise.resolve({
          id: "1",
          username: "testuser",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          createdBy: "admin",
          updatedBy: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
      delete = mock(() => Promise.resolve(true));
      findWithFilters = mock(() =>
        Promise.resolve([
          {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            createdBy: "admin",
            updatedBy: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ])
      );
    },
  };
});

describe("UserService Tests", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("createUser", () => {
    test("should create a user successfully", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        password: "password123",
      };

      const result = await userService.createUser(userData as any, "admin");

      expect(result).toBeDefined();
      expect(result.id).toBe("1");
      expect(result.username).toBe("testuser");
      expect(result.email).toBe("test@example.com");
      expect(result.firstName).toBe("Test");
      expect(result.lastName).toBe("User");
      expect(result.createdBy).toBe("admin");
      expect(result.updatedBy).toBe("admin");
    });

    test("should throw an error when creation fails", async () => {
      // Prisma modülünü yeniden mockla, bu sefer hata fırlatacak şekilde
      const prisma = require("../../../config/prisma").default;
      const originalCreate = prisma.user.create;

      // Geçici olarak create fonksiyonunu hata fırlatacak şekilde değiştir
      prisma.user.create = mock(() =>
        Promise.reject(new Error("Database error"))
      );

      const userData = {
        username: "testuser",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        password: "password123",
      };

      // Fonksiyonu çağır ve hata bekle
      try {
        await userService.createUser(userData as any, "admin");
        // Eğer buraya gelirse, test başarısız olmalı
        expect(true).toBe(false); // Bu satır çalışmamalı
      } catch (error: any) {
        expect(error.message).toContain("Database error");
      }

      // Orijinal fonksiyonu geri yükle
      prisma.user.create = originalCreate;
    });
  });

  describe("getUserById", () => {
    test("should return a user when found", async () => {
      const result = await userService.getUserById("1");

      expect(result).toBeDefined();
      expect(result?.id).toBe("1");
      expect(result?.username).toBe("testuser");
      expect(result?.email).toBe("test@example.com");
    });

    test("should throw an error when database operation fails", async () => {
      // Yeni bir UserService örneği oluştur
      const testUserService = new UserService();

      // userRepository.findById metodunu mockla
      const mockFindById = mock(() =>
        Promise.reject(new Error("Database error"))
      );

      // userRepository'yi değiştir
      (testUserService as any).userRepository = {
        findById: mockFindById,
      };

      // Fonksiyonu çağır ve hata bekle
      try {
        await testUserService.getUserById("1");
        // Eğer buraya gelirse, test başarısız olmalı
        expect(true).toBe(false); // Bu satır çalışmamalı
      } catch (error: any) {
        expect(error.message).toContain("Database error");
      }
    });
  });

  describe("getAllUsers", () => {
    test("should return all users", async () => {
      const result = await userService.getAllUsers();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("2");
    });
  });

  describe("updateUser", () => {
    test("should update a user successfully", async () => {
      const userData = {
        firstName: "Updated",
        lastName: "User",
      };

      const result = await userService.updateUser("1", userData, "admin");

      expect(result).toBeDefined();
      expect(result.id).toBe("1");
      expect(result.firstName).toBe("Updated");
      expect(result.updatedBy).toBe("admin");
    });
  });

  describe("deleteUser", () => {
    test("should delete a user successfully", async () => {
      const result = await userService.deleteUser("1");

      expect(result).toBe(true);
    });
  });

  describe("getUsersWithFilters", () => {
    test("should return filtered users", async () => {
      const filter = { username: "testuser" };

      const result = await userService.getUsersWithFilters(filter);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result?.length).toBe(1);
      expect(result?.[0].id).toBe("1");
      expect(result?.[0].username).toBe("testuser");
    });
  });
});
