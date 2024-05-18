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
}
