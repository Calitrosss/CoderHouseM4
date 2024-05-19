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

export const getUsersService = async () => {
  const result = await usersService.getUsers();
  return result;
};

export const deleteUsersService = async () => {
  const result = await usersService.deleteUsers();
  return result;
};

export const deleteUserByIdService = async (uid) => {
  const result = await usersService.deleteUserById(uid);
  return result;
};
