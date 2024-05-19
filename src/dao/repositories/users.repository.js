export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  putSwitchUserPremiumRole = async (uid) => {
    const result = await this.dao.putSwitchUserPremiumRole(uid);
    return result;
  };

  patchUserDocuments = async (uid, profile, identity, residence, account, products) => {
    const result = await this.dao.patchUserDocuments(
      uid,
      profile,
      identity,
      residence,
      account,
      products
    );
    return { status: "success", payload: result };
  };

  getUsers = async () => {
    const result = await this.dao.getUsers();
    return result;
  };

  deleteUsers = async () => {
    const result = await this.dao.deleteUsers();
    return result;
  };
}
