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
    return result;
  };
}
