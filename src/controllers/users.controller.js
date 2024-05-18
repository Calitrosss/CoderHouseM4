import { usersService } from "../dao/repositories/index.js";

import CustomError from "../errors/CustomError.js";
import ErrorEnum from "../errors/ErrorEnum.js";

export const putSwitchUserPremiumRole = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const result = await usersService.putSwitchUserPremiumRole(uid);
    if (result.status === "error")
      await CustomError.createError({
        name: "Switch user role error",
        cause: `Error putSwitchUserPremiumRole(): ${result.error}`,
        message: "Error trying switch role to user",
        code: ErrorEnum.FORBIDDEN,
      });

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const patchUserDocuments = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const profile = req.files.profile ? req.files["profile"][0].path.split("public").join("") : "";

    const identity = req.files.identity
      ? req.files["identity"][0].path.split("public").join("")
      : "";

    const residence = req.files.residence
      ? req.files["residence"][0].path.split("public").join("")
      : "";

    const account = req.files.account ? req.files["account"][0].path.split("public").join("") : "";

    const products = req.files.product ?? [];

    const result = await usersService.patchUserDocuments(
      uid,
      profile,
      identity,
      residence,
      account,
      products
    );

    if (result.status === "error")
      await CustomError.createError({
        name: "User documentation update error",
        cause: `Error patchUserDocuments(): ${result.error}`,
        message: "Error trying update documents to user",
        code: ErrorEnum.INVALID_PARAM,
      });

    res.send(result);
  } catch (error) {
    next(error);
  }
};
