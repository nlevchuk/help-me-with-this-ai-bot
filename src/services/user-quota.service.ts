import { User } from '../entity/User.js'

export const calculateAvailableApiCalls = (user: User): number => {
  return user.apiCallsLimit - user.apiCallsCount;
}
