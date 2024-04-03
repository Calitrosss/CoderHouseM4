import { userModel } from "../dao/models/user.model.js";

export const putSwitchUserPremiumRole = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await userModel.findOne({ _id: uid });
    if (!user) return { status: "error", error: `User not found` };

    await userModel.updateOne({ _id: uid }, { role: user.role === "user" ? "premium" : "user" });

    res.send({ status: "success", message: "Success" });
  } catch (error) {
    req.logger.error(`${new Date().toLocaleString()} => ${error}`);
    res.status(400).send({ status: "error", error: `${error}` });
  }
};
