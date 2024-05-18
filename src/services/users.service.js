import { usersService } from "../dao/repositories.js";

export const putSwitchUserPremiumRole = async (uid) => {
  const result = await usersService.putSwitchUserPremiumRole(uid);
  return result;
};

export const patchUserDocuments = async (uid, profile, identity, residence, account, products) => {
  const result = await usersService.patchUserDocuments(
    uid,
    profile,
    identity,
    residence,
    account,
    products
  );
  return result;
};
