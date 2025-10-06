import { type DataSource, MoreThan } from 'typeorm'

import { User } from '../entity/User.js'
import { InvitationToken } from '../entity/InvitationToken.js'
import { ApiStat } from '../entity/ApiStat.js'

type CreateUserOptions = {
  telegramId: string;
  invitationTokenId: string,
  apiCallsLimit: number | null,
  maxMessageLength: number | null,
}

type CreateApiStatsOptions = {
  userId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
}

export const createDbAdapter = (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User);
  const invitationTokenRepo = dataSource.getRepository(InvitationToken);
  const apiStatRepo = dataSource.getRepository(ApiStat);

  return {
    findActiveUserByTelegramId: async (telegramId: string): Promise<User | null> => {
      return await userRepo.findOne({
        where: {
          telegramId,
          isActive: true,
        },
      });
    },
    findUserById: async (id: string): Promise<User | null> => {
      return await userRepo.findOne({ where: { id } });
    },
    createUser: async (options: CreateUserOptions): Promise<string> => {
      const {
        telegramId,
        invitationTokenId,
        apiCallsLimit,
        maxMessageLength,
      } = options;

      const user = new User();
      user.telegramId = String(telegramId);
      user.invitationTokenId = invitationTokenId;
      if (apiCallsLimit !== null) { user.apiCallsLimit = apiCallsLimit }
      if (maxMessageLength !== null) { user.maxMessageLength = maxMessageLength }

      const createdUser = await userRepo.save(user);
      return createdUser.id;
    },
    updateUserLanguage: async (userId: string, language: string): Promise<void> => {  
      await userRepo.update(userId, { translationLanguage: language });
    },
    findUsersWithAvailableApiCalls: async (): Promise<User[]> => {
      return await userRepo.find({ where: { apiCallsCount: MoreThan(0) } });
    },
    resetApiCallsCount: async (userId: string): Promise<void> => {
      await userRepo.update(userId, { apiCallsCount: 0 });
    },
    incrementApiCalls: async (userId: string): Promise<void> => {
      await userRepo.increment({ id: userId }, 'apiCallsCount', 1);
    },
    findActiveInvitationToken: async (token: string): Promise<InvitationToken | null> => {
      return await invitationTokenRepo.findOne({
        where: {
          token,
          isActive: true,
        },
      });
    },
    deactivateInvitationTokenById: async (id: string): Promise<void> => {
      await invitationTokenRepo.update(id, { isActive: false });
    },
    createApiStats: async (options: CreateApiStatsOptions): Promise<void> => {
      const { userId, model, promptTokens, completionTokens } = options;

      const apiStat = new ApiStat();
      apiStat.userId = userId;
      apiStat.modelName = model;
      apiStat.promptTokens = promptTokens;
      apiStat.completionTokens = completionTokens;

      await apiStatRepo.save(apiStat);
    },
  };
}

export type DbAdapter = ReturnType<typeof createDbAdapter>;
