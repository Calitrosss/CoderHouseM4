import { usersService } from "../dao/repositories/index.js";

export const putSwitchUserPremiumRoleService = async (uid) => {
  const result = await usersService.putSwitchUserPremiumRole(uid);
  return result;
};

export const patchUserDocumentsService = async (
  uid,
  profile,
  identity,
  residence,
  account,
  products
) => {
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
