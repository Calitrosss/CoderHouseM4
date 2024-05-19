import { Router } from "express";
import { authorization, applyPolicy } from "../middlewares/auth.js";
import {
  putSwitchUserPremiumRole,
  patchUserDocuments,
  getUsers,
  deleteUsers,
  deleteUserById,
} from "../controllers/users.controller.js";
import { uploader } from "../middlewares/multer.js";

const usersRoutes = Router();

usersRoutes.put("/premium/:uid", authorization("admin"), putSwitchUserPremiumRole);

usersRoutes.patch(
  "/:uid/documents",
  applyPolicy(["user", "premium"]),
  uploader.fields([
    { name: "profile", maxCount: 1 },
    { name: "identity", maxCount: 1 },
    { name: "residence", maxCount: 1 },
    { name: "account", maxCount: 1 },
    { name: "product" },
  ]),
  patchUserDocuments
);

usersRoutes.get("/", authorization("admin"), getUsers);

usersRoutes.delete("/", authorization("admin"), deleteUsers);

usersRoutes.delete("/:uid", authorization("admin"), deleteUserById);

export default usersRoutes;
