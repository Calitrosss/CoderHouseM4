import { userModel } from "../models/user.model.js";

export default class UserManager {
  async putSwitchUserPremiumRole(uid) {
    try {
      const user = await userModel.findOne({ _id: uid });
      if (!user) return { status: "error", error: `User not found` };

      const identity = user.documents.find((d) => d.name === "identity");
      const residence = user.documents.find((d) => d.name === "residence");
      const account = user.documents.find((d) => d.name === "account");

      if (user.role === "user" && (!identity || !residence || !account))
        return { status: "error", error: `User has not finished processing his documentation.` };

      const newRole = user.role === "user" ? "premium" : "user";

      await userModel.updateOne({ _id: uid }, { role: newRole });

      return { status: "success", payload: `User role switched to ${newRole}` };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async patchUserDocuments(uid, profile, identity, residence, account, products) {
    try {
      if (!profile && !identity && !residence && !account && !products.length)
        return { status: "error", error: `Please select at least one file to update` };

      const user = await userModel.findOne({ _id: uid });
      if (!user) return { status: "error", error: `User not found` };

      let documents = user.documents.filter(
        (d) =>
          d.name !== "profile" &&
          d.name !== "identity" &&
          d.name !== "residence" &&
          d.name !== "account"
      );

      if (profile) documents = [...documents, { name: "profile", reference: profile }];

      if (identity) documents = [...documents, { name: "identity", reference: identity }];

      if (residence) documents = [...documents, { name: "residence", reference: residence }];

      if (account) documents = [...documents, { name: "account", reference: account }];

      products.forEach((p) => {
        documents = [...documents, { name: "product", reference: p.path.split("public").join("") }];
      });

      user.documents = documents;
      await user.save();

      return { status: "success", payload: "User documentation updated" };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async getUsers() {
    try {
      const users = await userModel.find({ role: { $ne: "admin" } });
      return users;
    } catch (error) {
      return [];
    }
  }

  async deleteUsers() {
    try {
      //** Anterior a 2 días */
      const inactiveTime = new Date();
      inactiveTime.setDate(inactiveTime.getDate() - 2);

      //** Anterior a 30 minutos */
      // const inactiveTime = new Date();
      // inactiveTime.setMinutes(inactiveTime.getMinutes() - 30);

      const usersDeleted = await userModel.find({
        last_connection: { $lte: inactiveTime },
      });

      const deleteResult = await userModel.deleteMany({
        last_connection: { $lte: inactiveTime },
      });

      return { status: "success", payload: usersDeleted, deletedCount: deleteResult.deletedCount };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }

  async deleteUserById(uid) {
    try {
      const user = await userModel.findOne({ _id: uid });
      if (!user) return { status: "error", error: `User Id "${uid}" Not found` };

      const result = await userModel.deleteOne({ _id: uid });
      if (!result.deletedCount) return { status: "error", error: `User Id "${uid}" Not found` };

      return {
        status: "success",
        payload: `Success: User ID "${uid}" deleted`,
        user: { first_name: user.first_name, last_name: user.last_name, email: user.email },
      };
    } catch (error) {
      return { status: "error", error: `${error}` };
    }
  }
}
