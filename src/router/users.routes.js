import { Router } from "express";
import { chekAuth, authorization } from "../middlewares/auth.js";
import { putSwitchUserPremiumRole, patchUserDocuments } from "../controllers/users.controller.js";
import { uploader } from "../middlewares/multer.js";

const usersRoutes = Router();

usersRoutes.put("/premium/:uid", chekAuth, authorization("admin"), putSwitchUserPremiumRole);

usersRoutes.patch(
  "/:uid/documents",
  chekAuth,
  uploader.fields([
    { name: "profile", maxCount: 1 },
    { name: "identity", maxCount: 1 },
    { name: "residence", maxCount: 1 },
    { name: "account", maxCount: 1 },
    { name: "product", maxCount: 5 },
  ]),
  patchUserDocuments
);

export default usersRoutes;
