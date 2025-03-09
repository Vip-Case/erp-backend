import BankService from "../../services/concrete/bankService";
import { Context } from "elysia";
import { Bank } from "@prisma/client";
import { extractUsernameFromToken } from "../../services/concrete/extractUsernameService";

// Service Initialization
const bankService = new BankService();

export const BankController = {
  createBank: async (ctx: Context) => {
    const bankData: Bank = ctx.body as Bank;
    const bearerToken = ctx.request.headers.get("Authorization");

    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }
    const username = extractUsernameFromToken(bearerToken);
    try {
      const bank = await bankService.createBank(bankData, username);
      ctx.set.status = 200;
      return bank;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error creating bank", details: error.message };
    }
  },

  updateBank: async (ctx: Context) => {
    const { id } = ctx.params;
    const bankData: Partial<Bank> = ctx.body as Partial<Bank>;
    const bearerToken = ctx.request.headers.get("Authorization");
    if (!bearerToken) {
      return ctx.error(401, "Authorization header is missing.");
    }
    const username = extractUsernameFromToken(bearerToken);
    try {
      const bank = await bankService.updateBank(id, bankData, username);
      ctx.set.status = 200;
      return bank;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error updating bank", details: error.message };
    }
  },

  deleteBank: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const bank = await bankService.deleteBank(id);
      ctx.set.status = 200;
      return bank;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error deleting bank", details: error.message };
    }
  },

  getBankById: async (ctx: Context) => {
    const { id } = ctx.params;
    try {
      const bank = await bankService.getBankById(id);
      if (!bank) {
        return ctx.error(404, "bank not found");
      }
      ctx.set.status = 200;
      return bank;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error fetching bank", details: error.message };
    }
  },

  getAllBanks: async (ctx: Context) => {
    try {
      const banks = await bankService.getAllBanks();
      ctx.set.status = 200;
      return banks;
    } catch (error: any) {
      ctx.set.status = 500;
      return { error: "Error fetching banks", details: error.message };
    }
  },
};

export default BankController;
