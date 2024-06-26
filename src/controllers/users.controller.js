import {
  putSwitchUserPremiumRoleService,
  patchUserDocumentsService,
  getUsersService,
  deleteUsersService,
  deleteUserByIdService,
} from "../services/users.service.js";

import UsersDTO from "../dao/dto/users.dto.js";

import CustomError from "../errors/CustomError.js";
import ErrorEnum from "../errors/ErrorEnum.js";

import { googleSendSimpleMail } from "../utils/mailing.js";

export const putSwitchUserPremiumRole = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const result = await putSwitchUserPremiumRoleService(uid);
    if (result.status === "error")
      await CustomError.createError({
        name: req.session.user?.role !== "admin" ? "Change user role error" : `${result.error}`,
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

    const result = await patchUserDocumentsService(
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

export const getUsers = async (req, res, next) => {
  try {
    const result = await getUsersService();
    let users = [];

    if (result) users = result.map((user) => new UsersDTO(user));

    res.send(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUsers = async (req, res, next) => {
  try {
    const result = await deleteUsersService();

    if (result.status === "success" && result.payload.length)
      result.payload.map((user) =>
        googleSendSimpleMail({
          from: "eCommerce",
          to: user.email,
          subject: "eCommerce - Eliminación de usuario",
          html: `
          Estimado ${user.first_name} ${user.last_name}, le informamos que su cuenta ha sido eliminada por inactividad. Saludos cordiales.
          `,
        })
      );

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const result = await deleteUserByIdService(uid);
    if (result.status === "error")
      await CustomError.createError({
        name: req.session.user?.role !== "admin" ? "Delete user error" : `${result.error}`,
        cause: `Error deleteUserById(): ${result.error}`,
        message: "Error trying to delete user",
        code: ErrorEnum.NOT_FOUND,
      });

    if (result.user?.email)
      googleSendSimpleMail({
        from: "eCommerce",
        to: result.user?.email,
        subject: "eCommerce - Eliminación de usuario",
        html: `
        Estimado ${result.user?.first_name} ${result.user?.last_name}, le informamos que su cuenta ha sido eliminada. Si tiene dudas por favor puede contactarse con nuestra administración. Saludos cordiales.
        `,
      });

    res.send(result);
  } catch (error) {
    next(error);
  }
};
