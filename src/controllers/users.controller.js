import { userModel } from "../dao/models/user.model.js";

export const putSwitchUserPremiumRole = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await userModel.findOne({ _id: uid });
    if (!user) return res.status(400).send({ status: "error", error: `User not found` });

    const identity = user.documents.find((d) => d.name === "identity");
    const residence = user.documents.find((d) => d.name === "residence");
    const account = user.documents.find((d) => d.name === "account");

    if (user.role === "user" && (!identity || !residence || !account))
      return res
        .status(403)
        .send({ status: "error", error: `User has not finished processing his documentation.` });

    await userModel.updateOne({ _id: uid }, { role: user.role === "user" ? "premium" : "user" });

    res.send({ status: "success", message: "Success" });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ status: "error", error: `${error}` });
  }
};

export const patchUserDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await userModel.findOne({ _id: uid });
    if (!user) return res.status(400).send({ status: "error", error: `User not found` });

    let documents = user.documents.filter(
      (d) =>
        d.name !== "profile" &&
        d.name !== "identity" &&
        d.name !== "residence" &&
        d.name !== "account"
    );

    const profile = req.files.profile ? req.files["profile"][0].path.split("public").join("") : "";
    if (profile) documents = [...documents, { name: "profile", reference: profile }];

    const identity = req.files.identity
      ? req.files["identity"][0].path.split("public").join("")
      : "";
    if (identity) documents = [...documents, { name: "identity", reference: identity }];

    const residence = req.files.residence
      ? req.files["residence"][0].path.split("public").join("")
      : "";
    if (residence) documents = [...documents, { name: "residence", reference: residence }];

    const account = req.files.account ? req.files["account"][0].path.split("public").join("") : "";
    if (account) documents = [...documents, { name: "account", reference: account }];

    const product = req.files.product ?? [];
    product.forEach((p) => {
      documents = [...documents, { name: "product", reference: p.path.split("public").join("") }];
    });

    user.documents = documents;
    await user.save();

    res.send({ status: "success", message: "Success" });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ status: "error", error: `${error}` });
  }
};
