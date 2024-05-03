import { userModel } from "../dao/models/user.model.js";

export const putSwitchUserPremiumRole = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await userModel.findOne({ _id: uid });
    if (!user) return res.status(400).send({ status: "error", error: `User not found` });

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

    const profile = req.files["profile"]
      ? req.files["profile"][0].path.split("public").join("")
      : "";

    const identity = req.files["identity"]
      ? req.files["identity"][0].path.split("public").join("")
      : "";

    const residence = req.files["identity"]
      ? req.files["residence"][0].path.split("public").join("")
      : "";

    const account = req.files["account"]
      ? req.files["account"][0].path.split("public").join("")
      : "";

    const product = req.files["product"] ?? [];

    res.send({ status: "success", message: "Success" });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ status: "error", error: `${error}` });
  }
};
